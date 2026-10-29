<script setup lang="ts">
import type { WallpaperListResponse } from '#shared/types/wallpaper'
import { WALLPAPER_CATEGORIES } from '#shared/constants/categories'
import { DEFAULT_SEARCH_QUERY, TRENDING_SEARCHES } from '#shared/constants/search'

const route = useRoute()
const router = useRouter()

const page = computed(() => {
  const value = Number(route.query.page)
  return Number.isInteger(value) && value > 0 ? value : 1
})

const { data, status, error } = await useFetch<WallpaperListResponse>('/api/wallpapers', {
  query: { page }
})

const items = computed(() => data.value?.items ?? [])
const isLoading = computed(() => status.value === 'pending')
const providerCount = computed(() => data.value?.providers.length ?? 0)
const searchTerm = ref(DEFAULT_SEARCH_QUERY)

function submitSearch(value: string) {
  router.push({ path: '/search', query: { q: value || DEFAULT_SEARCH_QUERY } })
}

function searchFor(value: string) {
  router.push({ path: '/search', query: { q: value } })
}

useSeoMeta({
  title: 'Wallpaper Studio — 4K wallpapers for every screen',
  description: 'Search and download high resolution wallpapers for desktop, tablet and mobile.',
  ogTitle: 'Wallpaper Studio',
  ogDescription: 'Search and download high resolution wallpapers for desktop, tablet and mobile.'
})
</script>

<template>
  <div class="container page">
    <section class="hero">
      <p class="hero__eyebrow">Wallpaper Studio</p>
      <h1 class="hero__title">Discover wallpapers for every screen.</h1>
      <p class="hero__subtitle">Explore high-resolution wallpapers for desktop, mobile and tablet.</p>
      <SearchInput v-model="searchTerm" @submit="submitSearch" />
      <div class="hero__group">
        <span class="hero__label">Trending searches</span>
        <div class="row">
          <button
            v-for="term in TRENDING_SEARCHES"
            :key="term"
            type="button"
            class="chip"
            @click="searchFor(term)"
          >
            {{ term }}
          </button>
        </div>
      </div>
      <div class="hero__group">
        <span class="hero__label">Categories</span>
        <div class="row">
          <NuxtLink
            v-for="category in WALLPAPER_CATEGORIES"
            :key="category.slug"
            :to="`/categories/${category.slug}`"
            class="chip"
          >
            {{ category.label }}
          </NuxtLink>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="section__header">
        <h2 class="section__title">Featured wallpapers</h2>
        <p class="muted">Default search “{{ DEFAULT_SEARCH_QUERY }}” · {{ providerCount }} providers</p>
      </div>

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
.hero {
  display: grid;
  gap: var(--spacing-4);
  padding-block: var(--spacing-6) var(--spacing-2);
  max-width: 900px;
}

.hero__eyebrow {
  color: var(--color-accent);
  font-size: 0.8125rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.hero__title {
  font-size: clamp(2rem, 5vw, 3.5rem);
  line-height: 1.05;
  letter-spacing: -0.04em;
}

.hero__subtitle {
  max-width: 620px;
  color: var(--color-text-muted);
  font-size: clamp(1rem, 1.6vw, 1.25rem);
}

.hero__group {
  display: grid;
  gap: var(--spacing-2);
}

.hero__label {
  color: var(--color-text-muted);
  font-size: 0.8125rem;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
</style>
