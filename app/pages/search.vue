<script setup lang="ts">
import type { WallpaperListResponse } from '#shared/types/wallpaper'
import { WALLPAPER_CATEGORIES } from '#shared/constants/categories'
import { DEFAULT_SEARCH_QUERY } from '#shared/constants/search'

const route = useRoute()
const router = useRouter()

const page = computed(() => {
  const value = Number(route.query.page)
  return Number.isInteger(value) && value > 0 ? value : 1
})

const provider = computed(() => typeof route.query.provider === 'string' ? route.query.provider : '')
const orientation = computed(() => typeof route.query.orientation === 'string' ? route.query.orientation : '')
const activeQuery = computed(() => typeof route.query.q === 'string' ? route.query.q : DEFAULT_SEARCH_QUERY)

const searchTerm = ref(activeQuery.value)

const query = computed(() => ({
  q: activeQuery.value,
  page: page.value,
  provider: provider.value || undefined,
  orientation: orientation.value || undefined
}))

const { data, status, error } = await useFetch<WallpaperListResponse>('/api/wallpapers/search', {
  query
})

const items = computed(() => data.value?.items ?? [])
const isLoading = computed(() => status.value === 'pending')

let debounceTimer: ReturnType<typeof setTimeout> | undefined

function applyQuery(value: string) {
  router.push({
    path: '/search',
    query: {
      ...route.query,
      q: value || DEFAULT_SEARCH_QUERY,
      page: undefined
    }
  })
}

function submitSearch(value: string) {
  if (debounceTimer) clearTimeout(debounceTimer)
  applyQuery(value)
}

function onFilterChange(key: 'provider' | 'orientation', event: Event) {
  const target = event.target as HTMLSelectElement
  router.push({
    path: '/search',
    query: {
      ...route.query,
      [key]: target.value || undefined,
      page: undefined
    }
  })
}

function onCategoryChange(event: Event) {
  const target = event.target as HTMLSelectElement
  if (target.value) router.push(`/categories/${target.value}`)
}

watch(searchTerm, (value) => {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    if (value.trim() === activeQuery.value) return
    applyQuery(value.trim())
  }, 450)
})

watch(activeQuery, (value) => {
  if (value !== searchTerm.value) searchTerm.value = value
})

onBeforeUnmount(() => {
  if (debounceTimer) clearTimeout(debounceTimer)
})

useSeoMeta({
  title: () => `Search: ${activeQuery.value} — Wallpaper Studio`,
  description: () => `Wallpaper search results for ${activeQuery.value}.`,
  robots: 'noindex, follow'
})
</script>

<template>
  <div class="container page">
    <section class="stack">
      <h1 class="page-title">Search wallpapers</h1>
      <SearchInput v-model="searchTerm" @submit="submitSearch" />
      <div class="filters">
        <label class="field">
          Provider
          <select :value="provider" @change="onFilterChange('provider', $event)">
            <option value="">All providers</option>
            <option value="unsplash">Unsplash</option>
            <option value="pexels">Pexels</option>
            <option value="pixabay">Pixabay</option>
          </select>
        </label>
        <label class="field">
          Orientation
          <select :value="orientation" @change="onFilterChange('orientation', $event)">
            <option value="">Any orientation</option>
            <option value="landscape">Landscape</option>
            <option value="portrait">Portrait</option>
            <option value="squarish">Square</option>
          </select>
        </label>
        <label class="field">
          Category
          <select value="" @change="onCategoryChange">
            <option value="">Browse a category</option>
            <option v-for="category in WALLPAPER_CATEGORIES" :key="category.slug" :value="category.slug">
              {{ category.label }}
            </option>
          </select>
        </label>
      </div>
      <p class="muted results-count">
        {{ data?.total ? `${data.total} results` : 'Results' }} for “{{ activeQuery }}”
      </p>
    </section>

    <section class="section">
      <div v-if="error" class="error-state">
        <p>Search failed.</p>
        <p>{{ error.data?.statusMessage || error.message }}</p>
      </div>
      <WallpaperGrid v-else :items="items" :loading="isLoading" />
      <Pagination :page="page" :has-more="data?.hasMore ?? false" />
    </section>
  </div>
</template>

<style scoped>
.page-title {
  font-size: clamp(1.75rem, 3vw, 2.5rem);
  letter-spacing: -0.03em;
}

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-4);
}

.results-count {
  font-size: 0.875rem;
}
</style>
