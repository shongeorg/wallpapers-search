<script setup lang="ts">
const { favorites, load } = useFavorites()

onMounted(load)

useSeoMeta({
  title: 'Favorites — Wallpaper Studio',
  description: 'Wallpapers you saved locally on this device.',
  robots: 'noindex, follow'
})
</script>

<template>
  <div class="container page">
    <section class="stack">
      <h1 class="page-title">Favorites</h1>
      <p class="muted">Saved in this browser. No account required.</p>
    </section>

    <section class="section">
      <div v-if="favorites.length === 0" class="empty-state">
        <p>No favorites yet.</p>
        <p>Tap the heart on any wallpaper to keep it here.</p>
        <NuxtLink to="/" class="button">Browse wallpapers</NuxtLink>
      </div>
      <WallpaperGrid v-else :items="favorites" />
    </section>
  </div>
</template>

<style scoped>
.page-title {
  font-size: clamp(1.75rem, 3vw, 2.5rem);
  letter-spacing: -0.03em;
}
</style>
