import { SIMILAR_WALLPAPERS_LIMIT } from '#shared/constants/search'
import { getSimilarWallpapers } from '../../services/wallpaper/wallpaper.service'
import { enforceRateLimit } from '../../utils/rateLimit'
import { badRequest } from '../../utils/errors'
import { parseLimit } from '../../utils/validation'

export default defineCachedEventHandler(async (event) => {
  enforceRateLimit(event)
  const query = getQuery(event)
  if (typeof query.id !== 'string' || query.id.length === 0) throw badRequest('Wallpaper id is required')
  const limit = Math.min(parseLimit(query.limit), SIMILAR_WALLPAPERS_LIMIT)
  return await getSimilarWallpapers(event, query.id, limit)
}, {
  maxAge: 600,
  swr: true,
  getKey: event => `similar:${getRequestURL(event).search}`
})
