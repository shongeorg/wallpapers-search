<script setup lang="ts">
import { WALLPAPER_CATEGORIES } from '#shared/constants/categories'

useSeoMeta({
  title: 'Wallpaper categories — Wallpaper Studio',
  description: 'Browse wallpapers by category: nature, space, anime, cars, minimal and more.'
})
</script>

<template>
  <div class="container page">
    <section class="stack">
      <h1 class="page-title">Categories</h1>
      <p class="muted">Pick a theme and explore matching wallpapers from every provider.</p>
    </section>

    <section>
      <div class="category-grid">
        <NuxtLink
          v-for="category in WALLPAPER_CATEGORIES"
          :key="category.slug"
          :to="`/categories/${category.slug}`"
          class="category-card"
        >
          <span class="category-card__label">{{ category.label }}</span>
          <span class="category-card__hint">{{ category.query }}</span>
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<style scoped>
.page-title {
  font-size: clamp(1.75rem, 3vw, 2.5rem);
  letter-spacing: -0.03em;
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: var(--spacing-4);
}

.category-card {
  display: grid;
  gap: 6px;
  padding: var(--spacing-6);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-surface);
  transition: border-color var(--transition), transform var(--transition);
}

.category-card:hover {
  border-color: var(--color-accent);
  transform: translateY(-2px);
}

.category-card__label {
  font-size: 1.125rem;
  font-weight: 600;
}

.category-card__hint {
  color: var(--color-text-muted);
  font-size: 0.875rem;
}
</style>
