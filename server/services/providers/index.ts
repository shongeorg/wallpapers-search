import type { H3Event } from 'h3'
import type { WallpaperProvider } from '#shared/types/wallpaper'
import { readProviderKeys } from '../../utils/providerKeys'
import type { WallpaperProviderAdapter } from './provider.interface'
import { createUnsplashProvider } from './unsplash.provider'
import { createPexelsProvider } from './pexels.provider'
import { createPixabayProvider } from './pixabay.provider'

export function getConfiguredProviders(event: H3Event): WallpaperProviderAdapter[] {
  const keys = readProviderKeys(event)
  const adapters: WallpaperProviderAdapter[] = []
  if (keys.unsplash) adapters.push(createUnsplashProvider(keys.unsplash))
  if (keys.pexels) adapters.push(createPexelsProvider(keys.pexels))
  if (keys.pixabay) adapters.push(createPixabayProvider(keys.pixabay))
  return adapters
}

export function getProvider(event: H3Event, provider: WallpaperProvider): WallpaperProviderAdapter | undefined {
  return getConfiguredProviders(event).find(adapter => adapter.id === provider)
}
