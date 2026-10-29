import type { H3Event } from 'h3'

export interface ProviderKeys {
  unsplash: string
  pexels: string
  pixabay: string
}

export function readProviderKeys(event: H3Event): ProviderKeys {
  const config = useRuntimeConfig(event)
  return {
    unsplash: process.env.UNSPLASH_API_KEY || String(config.unsplashApiKey || ''),
    pexels: process.env.PEXELS_API_KEY || String(config.pexelsApiKey || ''),
    pixabay: process.env.PIXABAY_API_KEY || String(config.pixabayApiKey || '')
  }
}
