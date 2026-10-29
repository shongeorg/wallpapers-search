import { DEFAULT_SEARCH_QUERY } from '#shared/constants/search'
import { searchWallpapers } from '../../services/wallpaper/wallpaper.service'
import { enforceRateLimit } from '../../utils/rateLimit'
import { parseLimit, parseOrientation, parsePage, parseProvider, parseQuery } from '../../utils/validation'

export default defineCachedEventHandler(async (event) => {
  enforceRateLimit(event)
  const query = getQuery(event)
  return await searchWallpapers(event, {
    query: parseQuery(query.q) || DEFAULT_SEARCH_QUERY,
    page: parsePage(query.page),
    limit: parseLimit(query.limit),
    provider: parseProvider(query.provider),
    orientation: parseOrientation(query.orientation)
  })
}, {
  maxAge: 300,
  swr: true,
  getKey: event => `catalog:${getRequestURL(event).pathname}:${getRequestURL(event).search}`
})
