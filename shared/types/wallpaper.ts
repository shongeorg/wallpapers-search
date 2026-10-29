export type WallpaperProvider = 'unsplash' | 'pexels' | 'pixabay'

export type WallpaperOrientation = 'landscape' | 'portrait' | 'squarish'

export interface WallpaperAuthor {
  name: string
  url?: string
}

export interface WallpaperResolution {
  label: string
  url: string
  width?: number
  height?: number
}

export interface Wallpaper {
  id: string
  provider: WallpaperProvider
  title: string
  description?: string
  category?: string
  tags: string[]
  width: number
  height: number
  aspectRatio: number
  thumbnailUrl: string
  previewUrl: string
  downloadUrl?: string
  sourceUrl: string
  author?: WallpaperAuthor
  resolutions: WallpaperResolution[]
}

export interface WallpaperSummary {
  id: string
  provider: WallpaperProvider
  title: string
  thumbnailUrl: string
  previewUrl: string
  width: number
  height: number
  sourceUrl: string
}

export interface FavoriteWallpaper extends WallpaperSummary {
  savedAt: number
}

export interface WallpaperListResponse {
  items: Wallpaper[]
  page: number
  limit: number
  total?: number
  hasMore: boolean
  providers: WallpaperProvider[]
}

export interface WallpaperSearchParams {
  q?: string
  page?: number
  limit?: number
  provider?: WallpaperProvider
  category?: string
  orientation?: WallpaperOrientation
}
