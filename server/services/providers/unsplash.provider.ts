import type { Wallpaper } from '#shared/types/wallpaper'
import { buildWallpaperId, normalizeText, truncateText } from '#shared/utils/wallpaper'
import type { ProviderSearchParams, ProviderSearchResult, WallpaperProviderAdapter } from './provider.interface'

const API_URL = 'https://api.unsplash.com'

const TIMEOUT_MS = 8_000

interface UnsplashPhoto {
  id: string
  width: number
  height: number
  description: string | null
  alt_description: string | null
  urls: {
    raw: string
    full: string
    regular: string
    small: string
    thumb: string
  }
  links: {
    html: string
  }
  user: {
    name: string
    links: {
      html: string
    }
  }
  tags?: Array<{ title: string }>
}

interface UnsplashSearchResponse {
  total: number
  total_pages: number
  results: UnsplashPhoto[]
}

function toWallpaper(photo: UnsplashPhoto): Wallpaper {
  const rawTitle = photo.description ?? photo.alt_description ?? ''
  const title = truncateText(normalizeText(rawTitle) || 'Untitled wallpaper', 90)
  const description = photo.description ? normalizeText(photo.description) : undefined
  const tags = (photo.tags ?? []).map(tag => normalizeText(tag.title)).filter(tag => tag.length > 0)
  return {
    id: buildWallpaperId('unsplash', photo.id),
    provider: 'unsplash',
    title,
    description,
    tags,
    width: photo.width,
    height: photo.height,
    aspectRatio: photo.height > 0 ? photo.width / photo.height : 1,
    thumbnailUrl: photo.urls.thumb,
    previewUrl: photo.urls.regular,
    downloadUrl: photo.urls.full,
    sourceUrl: photo.links.html,
    author: {
      name: photo.user.name,
      url: photo.user.links.html
    },
    resolutions: [
      { label: 'Small', url: photo.urls.small },
      { label: 'Regular', url: photo.urls.regular },
      { label: 'Full', url: photo.urls.full, width: photo.width, height: photo.height }
    ]
  }
}

async function request<T>(path: string, apiKey: string, query: Record<string, string | number | undefined>): Promise<T> {
  return await $fetch<T>(`${API_URL}${path}`, {
    query,
    headers: { Authorization: `Client-ID ${apiKey}` },
    signal: AbortSignal.timeout(TIMEOUT_MS)
  })
}

export function createUnsplashProvider(apiKey: string): WallpaperProviderAdapter {
  return {
    id: 'unsplash',
    async search(params: ProviderSearchParams): Promise<ProviderSearchResult> {
      const response = await request<UnsplashSearchResponse>('/search/photos', apiKey, {
        query: params.query,
        page: params.page,
        per_page: params.perPage,
        orientation: params.orientation,
        content_filter: 'high'
      })
      const results = response.results ?? []
      return {
        provider: 'unsplash',
        items: results.map(toWallpaper),
        total: response.total,
        hasMore: params.page < (response.total_pages ?? 0)
      }
    },
    async getById(sourceId: string): Promise<Wallpaper | null> {
      try {
        const photo = await request<UnsplashPhoto>(`/photos/${encodeURIComponent(sourceId)}`, apiKey, {})
        return toWallpaper(photo)
      } catch {
        return null
      }
    }
  }
}
