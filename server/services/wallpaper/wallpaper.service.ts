import type { H3Event } from 'h3'
import type {
  Wallpaper,
  WallpaperListResponse,
  WallpaperOrientation,
  WallpaperProvider
} from '#shared/types/wallpaper'
import { parseWallpaperId, slugify } from '#shared/utils/wallpaper'
import { getConfiguredProviders, getProvider } from '../providers'
import { badRequest, notFound, serviceUnavailable, upstreamFailure } from '../../utils/errors'

const ALLOWED_HOSTS: Record<WallpaperProvider, string[]> = {
  unsplash: ['images.unsplash.com'],
  pexels: ['images.pexels.com'],
  pixabay: ['cdn.pixabay.com', 'pixabay.com']
}

const MAX_SIMILAR_LIMIT = 20

export interface SearchOptions {
  query: string
  page: number
  limit: number
  provider?: WallpaperProvider
  orientation?: WallpaperOrientation
}

export interface DownloadTarget {
  url: string
  filename: string
}

function isFulfilled<T>(result: PromiseSettledResult<T>): result is PromiseFulfilledResult<T> {
  return result.status === 'fulfilled'
}

function interleave(lists: Wallpaper[][]): Wallpaper[] {
  const seen = new Set<string>()
  const merged: Wallpaper[] = []
  const maxLength = lists.reduce((max, list) => Math.max(max, list.length), 0)
  for (let index = 0; index < maxLength; index += 1) {
    for (const list of lists) {
      const item = list[index]
      if (!item || seen.has(item.id)) continue
      seen.add(item.id)
      merged.push(item)
    }
  }
  return merged
}

function buildSimilarQuery(wallpaper: Wallpaper): string {
  if (wallpaper.tags.length > 0) return wallpaper.tags.slice(0, 3).join(' ')
  const words = wallpaper.title.split(/\s+/).filter(word => word.length > 2).slice(0, 5)
  if (words.length > 0) return words.join(' ')
  if (wallpaper.category) return wallpaper.category
  return 'wallpaper'
}

function extensionFromUrl(value: string): string {
  const match = new URL(value).pathname.match(/\.(jpe?g|png|webp|avif)$/i)
  return match?.[1]?.toLowerCase() ?? 'jpg'
}

function assertAllowedUrl(provider: WallpaperProvider, value: string) {
  let url: URL
  try {
    url = new URL(value)
  } catch {
    throw badRequest('Download URL is invalid')
  }
  if (url.protocol !== 'https:') throw badRequest('Download URL must use https')
  const allowed = ALLOWED_HOSTS[provider].some(host => url.hostname === host || url.hostname.endsWith(`.${host}`))
  if (!allowed) throw badRequest('Download host is not allowed')
}

export async function searchWallpapers(event: H3Event, options: SearchOptions): Promise<WallpaperListResponse> {
  const adapters = getConfiguredProviders(event)
  if (adapters.length === 0) throw serviceUnavailable('No wallpaper providers are configured')
  const selected = options.provider ? adapters.filter(adapter => adapter.id === options.provider) : adapters
  if (selected.length === 0) throw badRequest('Requested provider is not available')
  const settled = await Promise.allSettled(selected.map(adapter => adapter.search({
    query: options.query,
    page: options.page,
    perPage: options.limit,
    orientation: options.orientation
  })))
  const results = settled.filter(isFulfilled).map(result => result.value)
  if (results.length === 0) throw upstreamFailure('Wallpaper providers are unavailable')
  const items = interleave(results.map(result => result.items)).slice(0, options.limit)
  const total = results.reduce((sum, result) => sum + (result.total ?? 0), 0)
  return {
    items,
    page: options.page,
    limit: options.limit,
    total: total > 0 ? total : undefined,
    hasMore: results.some(result => result.hasMore),
    providers: results.map(result => result.provider)
  }
}

export async function getWallpaperById(event: H3Event, id: string): Promise<Wallpaper> {
  const parsed = parseWallpaperId(id)
  if (!parsed) throw badRequest('Invalid wallpaper id')
  const adapter = getProvider(event, parsed.provider)
  if (!adapter) throw serviceUnavailable('Requested provider is not configured')
  const wallpaper = await adapter.getById(parsed.sourceId)
  if (!wallpaper) throw notFound('Wallpaper not found')
  return wallpaper
}

export async function getSimilarWallpapers(event: H3Event, id: string, limit: number): Promise<WallpaperListResponse> {
  const wallpaper = await getWallpaperById(event, id)
  const adapters = getConfiguredProviders(event)
  const normalizedLimit = Math.min(Math.max(limit, 1), MAX_SIMILAR_LIMIT)
  const query = buildSimilarQuery(wallpaper)
  const settled = await Promise.allSettled(adapters.map(adapter => adapter.search({
    query,
    page: 1,
    perPage: normalizedLimit + 2
  })))
  const results = settled.filter(isFulfilled).map(result => result.value)
  const items = interleave(results.map(result => result.items))
    .filter(item => item.id !== wallpaper.id)
    .slice(0, normalizedLimit)
  return {
    items,
    page: 1,
    limit: normalizedLimit,
    total: items.length,
    hasMore: items.length >= normalizedLimit,
    providers: results.map(result => result.provider)
  }
}

export async function getDownloadTarget(event: H3Event, id: string, variant: number | null): Promise<DownloadTarget> {
  const wallpaper = await getWallpaperById(event, id)
  const resolutions = wallpaper.resolutions.filter(resolution => resolution.url.length > 0)
  const index = variant === null ? resolutions.length - 1 : Math.min(variant, resolutions.length - 1)
  const target = resolutions[index]
  if (!target) throw notFound('Download is not available for this wallpaper')
  assertAllowedUrl(wallpaper.provider, target.url)
  const filename = `${slugify(wallpaper.title)}-${wallpaper.width}x${wallpaper.height}.${extensionFromUrl(target.url)}`
  return { url: target.url, filename }
}
