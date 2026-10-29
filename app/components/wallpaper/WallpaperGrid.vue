<script setup lang="ts">
import type { FavoriteWallpaper, Wallpaper } from '#shared/types/wallpaper'

withDefaults(defineProps<{
  items: Array<Wallpaper | FavoriteWallpaper>
  loading?: boolean
  skeletonCount?: number
}>(), {
  loading: false,
  skeletonCount: 12
})
</script>

<template>
  <div v-if="loading" class="grid" aria-busy="true" aria-label="Loading wallpapers">
    <WallpaperSkeleton v-for="index in skeletonCount" :key="index" />
  </div>
  <div v-else-if="items.length > 0" class="grid">
    <WallpaperCard v-for="wallpaper in items" :key="wallpaper.id" :wallpaper="wallpaper" />
  </div>
  <div v-else class="empty-state">
    <p>No wallpapers found.</p>
    <p>Try a different search term, provider or orientation.</p>
  </div>
</template>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: var(--spacing-4);
}

@media (max-width: 900px) {
  .grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 380px) {
  .grid {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
