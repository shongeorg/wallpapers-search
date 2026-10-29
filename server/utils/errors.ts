export function badRequest(message: string) {
  return createError({ statusCode: 400, statusMessage: message })
}

export function notFound(message: string) {
  return createError({ statusCode: 404, statusMessage: message })
}

export function serviceUnavailable(message: string) {
  return createError({ statusCode: 503, statusMessage: message })
}

export function upstreamFailure(message: string) {
  return createError({ statusCode: 502, statusMessage: message })
}

export function tooManyRequests(message: string) {
  return createError({ statusCode: 429, statusMessage: message })
}
