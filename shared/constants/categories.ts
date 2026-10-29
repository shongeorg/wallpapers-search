export interface WallpaperCategory {
  slug: string
  label: string
  query: string
}

export const WALLPAPER_CATEGORIES: WallpaperCategory[] = [
  { slug: 'nature', label: 'Nature', query: 'nature wallpaper' },
  { slug: 'landscape', label: 'Landscape', query: 'landscape wallpaper' },
  { slug: 'space', label: 'Space', query: 'space wallpaper' },
  { slug: 'anime', label: 'Anime', query: 'anime wallpaper' },
  { slug: 'gaming', label: 'Gaming', query: 'gaming wallpaper' },
  { slug: 'cars', label: 'Cars', query: 'car wallpaper' },
  { slug: 'architecture', label: 'Architecture', query: 'architecture wallpaper' },
  { slug: 'abstract', label: 'Abstract', query: 'abstract wallpaper' },
  { slug: 'animals', label: 'Animals', query: 'animal wallpaper' },
  { slug: 'technology', label: 'Technology', query: 'technology wallpaper' },
  { slug: 'minimal', label: 'Minimal', query: 'minimal wallpaper' },
  { slug: 'movies', label: 'Movies', query: 'movie wallpaper' }
]

export function findCategory(slug: string): WallpaperCategory | undefined {
  return WALLPAPER_CATEGORIES.find(category => category.slug === slug)
}
