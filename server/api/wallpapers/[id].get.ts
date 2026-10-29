import { getWallpaperById } from '../../services/wallpaper/wallpaper.service'
import { enforceRateLimit } from '../../utils/rateLimit'
import { badRequest } from '../../utils/errors'

export default defineCachedEventHandler(async (event) => {
  enforceRateLimit(event)
  const id = getRouterParam(event, 'id')
  if (!id) throw badRequest('Wallpaper id is required')
  return await getWallpaperById(event, id)
}, {
  maxAge: 600,
  swr: true,
  getKey: event => `wallpaper:${getRequestURL(event).pathname}`
})
