import type { FavoriteWallpaper, Wallpaper, WallpaperSummary } from '#shared/types/wallpaper'

const STORAGE_KEY = 'wallpaper-studio:favorites'

export function useFavorites() {
  const favorites = useState<FavoriteWallpaper[]>('wallpaper-favorites', () => [])
  const ready = useState<boolean>('wallpaper-favorites-ready', () => false)

  function toFavorite(wallpaper: Wallpaper | WallpaperSummary): FavoriteWallpaper {
    return {
      id: wallpaper.id,
      provider: wallpaper.provider,
      title: wallpaper.title,
      thumbnailUrl: wallpaper.thumbnailUrl,
      previewUrl: wallpaper.previewUrl,
      width: wallpaper.width,
      height: wallpaper.height,
      sourceUrl: wallpaper.sourceUrl,
      savedAt: Date.now()
    }
  }

  function load() {
    if (!import.meta.client || ready.value) return
    ready.value = true
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return
      const parsed: unknown = JSON.parse(raw)
      if (!Array.isArray(parsed)) return
      favorites.value = parsed.filter((item): item is FavoriteWallpaper => {
        return Boolean(item) && typeof (item as FavoriteWallpaper).id === 'string'
      })
    } catch {
      favorites.value = []
    }
  }

  function persist() {
    if (!import.meta.client || !ready.value) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites.value))
    } catch {
      return
    }
  }

  function isFavorite(id: string): boolean {
    return favorites.value.some(item => item.id === id)
  }

  function toggle(wallpaper: Wallpaper | WallpaperSummary) {
    if (isFavorite(wallpaper.id)) {
      favorites.value = favorites.value.filter(item => item.id !== wallpaper.id)
      return
    }
    favorites.value = [toFavorite(wallpaper), ...favorites.value]
  }

  function remove(id: string) {
    favorites.value = favorites.value.filter(item => item.id !== id)
  }

  onMounted(load)
  watch(favorites, persist, { deep: true })

  return { favorites, ready, isFavorite, toggle, remove, load }
}
