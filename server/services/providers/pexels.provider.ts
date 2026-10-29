import type { Wallpaper } from '#shared/types/wallpaper'
import { buildWallpaperId, normalizeText, truncateText } from '#shared/utils/wallpaper'
import type { ProviderSearchParams, ProviderSearchResult, WallpaperProviderAdapter } from './provider.interface'

const API_URL = 'https://api.pexels.com'

const TIMEOUT_MS = 8_000

interface PexelsPhoto {
  id: number
  width: number
  height: number
  url: string
  photographer: string
  photographer_url: string
  alt: string | null
  src: {
    original: string
    large2x: string
    large: string
    medium: string
    small: string
    portrait: string
    landscape: string
    tiny: string
  }
}

interface PexelsSearchResponse {
  total_results: number
  page: number
  per_page: number
  photos: PexelsPhoto[]
  next_page?: string
}

function toTags(alt: string | null): string[] {
  if (!alt) return []
  return normalizeText(alt)
    .split(/[^a-zA-Z0-9]+/)
    .map(word => word.trim())
    .filter(word => word.length > 2)
    .slice(0, 6)
}

function toWallpaper(photo: PexelsPhoto): Wallpaper {
  const title = truncateText(normalizeText(photo.alt || `Pexels photo ${photo.id}`), 90)
  return {
    id: buildWallpaperId('pexels', String(photo.id)),
    provider: 'pexels',
    title,
    tags: toTags(photo.alt),
    width: photo.width,
    height: photo.height,
    aspectRatio: photo.height > 0 ? photo.width / photo.height : 1,
    thumbnailUrl: photo.src.medium,
    previewUrl: photo.src.large,
    downloadUrl: photo.src.original,
    sourceUrl: photo.url,
    author: {
      name: photo.photographer,
      url: photo.photographer_url
    },
    resolutions: [
      { label: 'Medium', url: photo.src.medium, width: Math.round(photo.width / 2), height: Math.round(photo.height / 2) },
      { label: 'Large', url: photo.src.large, width: photo.width, height: photo.height },
      { label: 'Original', url: photo.src.original, width: photo.width, height: photo.height }
    ]
  }
}

async function request<T>(path: string, apiKey: string, query: Record<string, string | number | undefined>): Promise<T> {
  return await $fetch<T>(`${API_URL}${path}`, {
    query,
    headers: { Authorization: apiKey },
    signal: AbortSignal.timeout(TIMEOUT_MS)
  })
}

export function createPexelsProvider(apiKey: string): WallpaperProviderAdapter {
  return {
    id: 'pexels',
    async search(params: ProviderSearchParams): Promise<ProviderSearchResult> {
      const orientation = params.orientation === 'squarish' ? 'square' : params.orientation
      const response = await request<PexelsSearchResponse>('/v1/search', apiKey, {
        query: params.query,
        page: params.page,
        per_page: params.perPage,
        orientation
      })
      const results = response.photos ?? []
      return {
        provider: 'pexels',
        items: results.map(toWallpaper),
        total: response.total_results,
        hasMore: Boolean(response.next_page)
      }
    },
    async getById(sourceId: string): Promise<Wallpaper | null> {
      try {
        const photo = await request<PexelsPhoto>(`/v1/photos/${encodeURIComponent(sourceId)}`, apiKey, {})
        return toWallpaper(photo)
      } catch {
        return null
      }
    }
  }
}
