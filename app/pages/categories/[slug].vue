<script setup lang="ts">
import type { WallpaperListResponse } from '#shared/types/wallpaper'
import { findCategory } from '#shared/constants/categories'

const route = useRoute()
const slug = String(route.params.slug)
const category = findCategory(slug)

if (!category) {
  throw createError({ statusCode: 404, statusMessage: 'Category not found' })
}

const page = computed(() => {
  const value = Number(route.query.page)
  return Number.isInteger(value) && value > 0 ? value : 1
})

const { data, status, error } = await useFetch<WallpaperListResponse>('/api/wallpapers/search', {
  query: computed(() => ({ q: category.query, page: page.value }))
})

const items = computed(() => data.value?.items ?? [])
const isLoading = computed(() => status.value === 'pending')

useSeoMeta({
  title: `${category.label} wallpapers — Wallpaper Studio`,
  description: `${category.label} wallpapers in high resolution for desktop, tablet and mobile.`
})
</script>

<template>
  <div class="container page">
    <nav class="breadcrumbs" aria-label="Breadcrumb">
      <NuxtLink to="/categories">Categories</NuxtLink>
      <span aria-hidden="true">/</span>
      <span>{{ category.label }}</span>
    </nav>

    <section class="stack">
      <h1 class="page-title">{{ category.label }} wallpapers</h1>
      <p class="muted">{{ data?.total ? `${data.total} results` : 'Results' }} from every configured provider.</p>
    </section>

    <section class="section">
      <div v-if="error" class="error-state">
        <p>Wallpapers could not be loaded.</p>
        <p>{{ error.data?.statusMessage || error.message }}</p>
      </div>
      <WallpaperGrid v-else :items="items" :loading="isLoading" />
      <Pagination :page="page" :has-more="data?.hasMore ?? false" />
    </section>
  </div>
</template>

<style scoped>
.breadcrumbs {
  display: flex;
  gap: var(--spacing-2);
  color: var(--color-text-muted);
  font-size: 0.875rem;
}

.breadcrumbs a:hover {
  color: var(--color-text);
}

.page-title {
  font-size: clamp(1.75rem, 3vw, 2.5rem);
  letter-spacing: -0.03em;
}
</style>
