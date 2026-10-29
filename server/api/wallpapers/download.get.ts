import { getDownloadTarget } from '../../services/wallpaper/wallpaper.service'
import { enforceRateLimit } from '../../utils/rateLimit'
import { badRequest, upstreamFailure } from '../../utils/errors'
import { parseVariant } from '../../utils/validation'

const MAX_DOWNLOAD_BYTES = 40 * 1024 * 1024

const DOWNLOAD_TIMEOUT_MS = 20_000

export default defineEventHandler(async (event) => {
  enforceRateLimit(event)
  const query = getQuery(event)
  if (typeof query.id !== 'string' || query.id.length === 0) throw badRequest('Wallpaper id is required')
  const target = await getDownloadTarget(event, query.id, parseVariant(query.variant))
  const upstream = await fetch(target.url, {
    headers: { accept: 'image/*' },
    signal: AbortSignal.timeout(DOWNLOAD_TIMEOUT_MS)
  })
  if (!upstream.ok || !upstream.body) throw upstreamFailure('Download is unavailable')
  const contentType = upstream.headers.get('content-type') ?? ''
  if (!contentType.startsWith('image/')) throw upstreamFailure('Unexpected download content')
  const size = Number(upstream.headers.get('content-length') ?? 0)
  if (size > MAX_DOWNLOAD_BYTES) throw createError({ statusCode: 413, statusMessage: 'File is too large' })
  return new Response(upstream.body, {
    status: 200,
    headers: {
      'content-type': contentType,
      'content-disposition': `attachment; filename="${target.filename}"`,
      'cache-control': 'public, max-age=3600'
    }
  })
})
