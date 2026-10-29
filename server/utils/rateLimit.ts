import type { H3Event } from 'h3'
import { tooManyRequests } from './errors'

const WINDOW_MS = 60_000

const MAX_REQUESTS = 90

const MAX_BUCKETS = 5_000

const buckets = new Map<string, { count: number, resetAt: number }>()

function prune(now: number) {
  if (buckets.size < MAX_BUCKETS) return
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key)
  }
}

export function enforceRateLimit(event: H3Event) {
  const address = getRequestIP(event, { xForwardedFor: true }) ?? 'unknown'
  const now = Date.now()
  prune(now)
  const bucket = buckets.get(address)
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(address, { count: 1, resetAt: now + WINDOW_MS })
    return
  }
  bucket.count += 1
  if (bucket.count > MAX_REQUESTS) throw tooManyRequests('Too many requests, try again later')
}
