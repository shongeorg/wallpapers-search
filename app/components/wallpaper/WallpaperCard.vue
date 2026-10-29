<script setup lang="ts">
import type { FavoriteWallpaper, Wallpaper } from '#shared/types/wallpaper'
import { formatResolution } from '#shared/utils/wallpaper'

const props = defineProps<{
  wallpaper: Wallpaper | FavoriteWallpaper
}>()

const providerLabel = computed(() => {
  const labels: Record<string, string> = {
    unsplash: 'Unsplash',
    pexels: 'Pexels',
    pixabay: 'Pixabay'
  }
  return labels[props.wallpaper.provider] ?? props.wallpaper.provider
})

const aspectRatio = computed(() => {
  if (props.wallpaper.height <= 0) return 1
  return props.wallpaper.width / props.wallpaper.height
})

const href = computed(() => `/wallpaper/${encodeURIComponent(props.wallpaper.id)}`)
</script>

<template>
  <NuxtLink :to="href" class="card">
    <div class="card__media" :style="{ aspectRatio }">
      <img
        :src="wallpaper.thumbnailUrl"
        :alt="wallpaper.title"
        :width="wallpaper.width"
        :height="wallpaper.height"
        loading="lazy"
        decoding="async"
      >
      <span class="card__provider">{{ providerLabel }}</span>
      <FavoriteButton :wallpaper="wallpaper" size="sm" class="card__favorite" />
    </div>
    <div class="card__body">
      <h3 class="card__title">{{ wallpaper.title }}</h3>
      <p class="card__meta">{{ formatResolution(wallpaper.width, wallpaper.height) }}</p>
    </div>
  </NuxtLink>
</template>

<style scoped>
.card {
  display: grid;
  gap: var(--spacing-2);
  min-width: 0;
}

.card__media {
  position: relative;
  overflow: hidden;
  border-radius: var(--radius-md);
  background: var(--color-surface);
  box-shadow: inset 0 0 0 1px var(--color-border);
}

.card__media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 280ms ease;
}

.card:hover .card__media img {
  transform: scale(1.04);
}

.card__provider {
  position: absolute;
  left: var(--spacing-2);
  bottom: var(--spacing-2);
  padding: 3px 8px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--color-background) 72%, transparent);
  color: var(--color-text);
  font-size: 0.6875rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.card__favorite {
  position: absolute;
  top: var(--spacing-2);
  right: var(--spacing-2);
  opacity: 0;
  transition: opacity var(--transition);
}

.card:hover .card__favorite,
.card:focus-within .card__favorite,
.card__favorite.is-active {
  opacity: 1;
}

.card__body {
  display: grid;
  gap: 2px;
}

.card__title {
  overflow: hidden;
  font-size: 0.9375rem;
  font-weight: 500;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card__meta {
  color: var(--color-text-muted);
  font-size: 0.8125rem;
}

@media (hover: none) {
  .card__favorite {
    opacity: 1;
  }
}
</style>
