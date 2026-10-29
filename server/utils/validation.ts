import type { WallpaperOrientation, WallpaperProvider } from '#shared/types/wallpaper'
import { DEFAULT_PAGE_SIZE, MAX_PAGE, MAX_PAGE_SIZE, MAX_QUERY_LENGTH } from '#shared/constants/search'

const PROVIDERS: WallpaperProvider[] = ['unsplash', 'pexels', 'pixabay']

const ORIENTATIONS: WallpaperOrientation[] = ['landscape', 'portrait', 'squarish']

export function parsePage(value: unknown): number {
  const parsed = Number(value)
  if (!Number.isInteger(parsed) || parsed < 1) return 1
  return Math.min(parsed, MAX_PAGE)
}

export function parseLimit(value: unknown): number {
  const parsed = Number(value)
  if (!Number.isInteger(parsed) || parsed < 1) return DEFAULT_PAGE_SIZE
  return Math.min(parsed, MAX_PAGE_SIZE)
}

export function parseQuery(value: unknown): string {
  if (typeof value !== 'string') return ''
  return value.trim().slice(0, MAX_QUERY_LENGTH)
}

export function parseProvider(value: unknown): WallpaperProvider | undefined {
  if (typeof value !== 'string') return undefined
  return PROVIDERS.includes(value as WallpaperProvider) ? value as WallpaperProvider : undefined
}

export function parseOrientation(value: unknown): WallpaperOrientation | undefined {
  if (typeof value !== 'string') return undefined
  return ORIENTATIONS.includes(value as WallpaperOrientation) ? value as WallpaperOrientation : undefined
}

export function parseCategory(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined
  const normalized = value.trim().toLowerCase()
  if (normalized.length === 0 || normalized.length > 40) return undefined
  return normalized
}

export function parseVariant(value: unknown): number | null {
  if (value === undefined || value === '') return null
  const parsed = Number(value)
  if (!Number.isInteger(parsed) || parsed < 0) return null
  return parsed
}
