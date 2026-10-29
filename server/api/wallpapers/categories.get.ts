import { WALLPAPER_CATEGORIES } from '#shared/constants/categories'
import { enforceRateLimit } from '../../utils/rateLimit'

export default defineCachedEventHandler(async (event) => {
  enforceRateLimit(event)
  return { categories: WALLPAPER_CATEGORIES }
}, {
  maxAge: 3600,
  swr: true,
  getKey: () => 'wallpaper-categories'
})
