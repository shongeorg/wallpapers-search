import type { WallpaperProvider } from '#shared/types/wallpaper'

const PROVIDER_IDS: WallpaperProvider[] = ['unsplash', 'pexels', 'pixabay']

export function buildWallpaperId(provider: WallpaperProvider, sourceId: string): string {
  return `${provider}:${sourceId}`
}

export function parseWallpaperId(value: string): { provider: WallpaperProvider, sourceId: string } | null {
  const separator = value.indexOf(':')
  if (separator <= 0) return null
  const provider = value.slice(0, separator) as WallpaperProvider
  const sourceId = value.slice(separator + 1)
  if (!PROVIDER_IDS.includes(provider) || sourceId.length === 0) return null
  return { provider, sourceId }
}

export function formatResolution(width: number, height: number): string {
  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) return 'Unknown size'
  return `${width} × ${height}`
}

export function formatAspectRatio(width: number, height: number): string {
  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) return 'Unknown'
  return `${(width / height).toFixed(2)}:1`
}

export function normalizeText(value: string): string {
  return value.replace(/\s+/g, ' ').trim()
}

export function truncateText(value: string, maxLength: number): string {
  if (value.length <= maxLength) return value
  return `${value.slice(0, maxLength - 1).trimEnd()}…`
}

export function slugify(value: string): string {
  const slug = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
  return slug || 'wallpaper'
}
