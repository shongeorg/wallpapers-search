import type { Wallpaper, WallpaperOrientation, WallpaperProvider } from '#shared/types/wallpaper'

export interface ProviderSearchParams {
  query: string
  page: number
  perPage: number
  orientation?: WallpaperOrientation
}

export interface ProviderSearchResult {
  provider: WallpaperProvider
  items: Wallpaper[]
  total?: number
  hasMore: boolean
}

export interface WallpaperProviderAdapter {
  id: WallpaperProvider
  search(params: ProviderSearchParams): Promise<ProviderSearchResult>
  getById(sourceId: string): Promise<Wallpaper | null>
}
