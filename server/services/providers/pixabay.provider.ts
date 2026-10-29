import type { Wallpaper } from '#shared/types/wallpaper'
import { buildWallpaperId, normalizeText, truncateText } from '#shared/utils/wallpaper'
import type { ProviderSearchParams, ProviderSearchResult, WallpaperProviderAdapter } from './provider.interface'

const API_URL = 'https://pixabay.com/api/'

const TIMEOUT_MS = 8_000

interface PixabayHit {
  id: number
  pageURL: string
  type: string
  tags: string
  previewURL: string
  previewWidth: number
  previewHeight: number
  webformatURL: string
  webformatWidth: number
  webformatHeight: number
  largeImageURL: string
  imageURL?: string
  imageWidth: number
  imageHeight: number
  user: string
  user_id: number
}

interface PixabaySearchResponse {
  total: number
  totalHits: number
  hits: PixabayHit[]
}

function toTags(tags: string): string[] {
  return tags
    .split(',')
    .map(tag => normalizeText(tag))
    .filter(tag => tag.length > 0)
    .slice(0, 10)
}

function toWallpaper(hit: PixabayHit): Wallpaper {
  const tags = toTags(hit.tags)
  const title = truncateText(tags[0] ? `${tags[0]} wallpaper` : `Pixabay image ${hit.id}`, 90)
  const originalUrl = hit.imageURL ?? hit.largeImageURL
  return {
    id: buildWallpaperId('pixabay', String(hit.id)),
    provider: 'pixabay',
    title,
    tags,
    width: hit.imageWidth,
    height: hit.imageHeight,
    aspectRatio: hit.imageHeight > 0 ? hit.imageWidth / hit.imageHeight : 1,
    thumbnailUrl: hit.previewURL,
    previewUrl: hit.largeImageURL,
    downloadUrl: originalUrl,
    sourceUrl: hit.pageURL,
    author: {
      name: hit.user,
      url: `https://pixabay.com/users/${encodeURIComponent(hit.user)}-${hit.user_id}/`
    },
    resolutions: [
      { label: 'Preview', url: hit.previewURL, width: hit.previewWidth, height: hit.previewHeight },
      { label: 'Web', url: hit.webformatURL, width: hit.webformatWidth, height: hit.webformatHeight },
      { label: 'Large', url: hit.largeImageURL, width: hit.imageWidth, height: hit.imageHeight }
    ]
  }
}

async function request<T>(apiKey: string, query: Record<string, string | number | undefined>): Promise<T> {
  return await $fetch<T>(API_URL, {
    query: { key: apiKey, safesearch: 'true', ...query },
    signal: AbortSignal.timeout(TIMEOUT_MS)
  })
}

export function createPixabayProvider(apiKey: string): WallpaperProviderAdapter {
  return {
    id: 'pixabay',
    async search(params: ProviderSearchParams): Promise<ProviderSearchResult> {
      const orientation = params.orientation === 'landscape'
        ? 'horizontal'
        : params.orientation === 'portrait'
          ? 'vertical'
          : 'all'
      const response = await request<PixabaySearchResponse>(apiKey, {
        q: params.query,
        page: params.page,
        per_page: Math.min(Math.max(params.perPage, 3), 200),
        image_type: 'photo',
        orientation
      })
      const results = response.hits ?? []
      const total = response.totalHits ?? 0
      return {
        provider: 'pixabay',
        items: results.map(toWallpaper),
        total,
        hasMore: params.page * params.perPage < total
      }
    },
    async getById(sourceId: string): Promise<Wallpaper | null> {
      try {
        const response = await request<PixabaySearchResponse>(apiKey, { id: sourceId })
        const hit = response.hits?.[0]
        return hit ? toWallpaper(hit) : null
      } catch {
        return null
      }
    }
  }
}
