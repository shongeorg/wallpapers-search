<script setup lang="ts">
import type { Wallpaper, WallpaperListResponse } from '#shared/types/wallpaper'
import { formatAspectRatio, formatResolution } from '#shared/utils/wallpaper'

const route = useRoute()
const id = computed(() => String(route.params.id))

const { data: wallpaper, status, error } = await useFetch<Wallpaper>(() => `/api/wallpapers/${encodeURIComponent(id.value)}`)

const { data: similar } = await useFetch<WallpaperListResponse>('/api/wallpapers/similar', {
  query: computed(() => ({ id: id.value }))
})

const isLoading = computed(() => status.value === 'pending')
const similarItems = computed(() => similar.value?.items ?? [])

const downloadHref = computed(() => {
  if (!wallpaper.value) return ''
  const variant = Math.max(wallpaper.value.resolutions.length - 1, 0)
  return `/api/wallpapers/download?id=${encodeURIComponent(wallpaper.value.id)}&variant=${variant}`
})

function downloadVariantHref(index: number) {
  if (!wallpaper.value) return ''
  return `/api/wallpapers/download?id=${encodeURIComponent(wallpaper.value.id)}&variant=${index}`
}

useSeoMeta({
  title: () => wallpaper.value ? `${wallpaper.value.title} — Wallpaper Studio` : 'Wallpaper — Wallpaper Studio',
  description: () => wallpaper.value?.description ?? 'Download this wallpaper in high resolution.',
  ogTitle: () => wallpaper.value?.title ?? 'Wallpaper Studio',
  ogImage: () => wallpaper.value?.previewUrl
})
</script>

<template>
  <div class="container page">
    <div v-if="isLoading" class="loading-state">
      <p class="muted">Loading wallpaper…</p>
    </div>

    <div v-else-if="error || !wallpaper" class="error-state">
      <p>This wallpaper is not available.</p>
      <p>{{ error?.data?.statusMessage || error?.message || 'The wallpaper could not be found.' }}</p>
      <NuxtLink to="/" class="button">Browse wallpapers</NuxtLink>
    </div>

    <template v-else>
      <nav class="breadcrumbs" aria-label="Breadcrumb">
        <NuxtLink to="/">Home</NuxtLink>
        <span aria-hidden="true">/</span>
        <span>{{ wallpaper.title }}</span>
      </nav>

      <article class="wallpaper">
        <div class="wallpaper__preview">
          <img
            :src="wallpaper.previewUrl"
            :alt="wallpaper.title"
            :width="wallpaper.width"
            :height="wallpaper.height"
          >
        </div>

        <div class="wallpaper__info">
          <h1 class="wallpaper__title">{{ wallpaper.title }}</h1>
          <p v-if="wallpaper.description" class="wallpaper__description">{{ wallpaper.description }}</p>

          <dl class="facts">
            <div class="facts__row">
              <dt>Provider</dt>
              <dd>{{ wallpaper.provider }}</dd>
            </div>
            <div class="facts__row">
              <dt>Resolution</dt>
              <dd>{{ formatResolution(wallpaper.width, wallpaper.height) }}</dd>
            </div>
            <div class="facts__row">
              <dt>Aspect ratio</dt>
              <dd>{{ formatAspectRatio(wallpaper.width, wallpaper.height) }}</dd>
            </div>
            <div v-if="wallpaper.author" class="facts__row">
              <dt>Author</dt>
              <dd>
                <a v-if="wallpaper.author.url" :href="wallpaper.author.url" target="_blank" rel="noopener noreferrer">
                  {{ wallpaper.author.name }}
                </a>
                <span v-else>{{ wallpaper.author.name }}</span>
              </dd>
            </div>
            <div class="facts__row">
              <dt>Source</dt>
              <dd>
                <a :href="wallpaper.sourceUrl" target="_blank" rel="noopener noreferrer">Open original page</a>
              </dd>
            </div>
          </dl>

          <div class="wallpaper__actions">
            <a :href="downloadHref" class="button button--accent" download>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M12 3v12m0 0 4-4m-4 4-4-4M4 19h16" />
              </svg>
              Download wallpaper
            </a>
            <FavoriteButton :wallpaper="wallpaper" />
          </div>

          <div v-if="wallpaper.resolutions.length > 0" class="resolutions">
            <h2 class="resolutions__title">Available sizes</h2>
            <ul class="resolutions__list">
              <li v-for="(resolution, index) in wallpaper.resolutions" :key="resolution.label">
                <a :href="downloadVariantHref(index)" class="resolution" download>
                  <span class="resolution__label">{{ resolution.label }}</span>
                  <span v-if="resolution.width && resolution.height" class="resolution__size">
                    {{ formatResolution(resolution.width, resolution.height) }}
                  </span>
                </a>
              </li>
            </ul>
          </div>

          <div v-if="wallpaper.tags.length > 0" class="tags">
            <h2 class="resolutions__title">Tags</h2>
            <div class="row">
              <NuxtLink
                v-for="tag in wallpaper.tags"
                :key="tag"
                :to="{ path: '/search', query: { q: tag } }"
                class="chip"
              >
                {{ tag }}
              </NuxtLink>
            </div>
          </div>
        </div>
      </article>

      <section class="section">
        <div class="section__header">
          <h2 class="section__title">Similar wallpapers</h2>
          <NuxtLink :to="{ path: '/search', query: { q: wallpaper.tags[0] || wallpaper.title } }" class="muted">
            More like this
          </NuxtLink>
        </div>
        <WallpaperGrid :items="similarItems" :skeleton-count="8" />
      </section>
    </template>
  </div>
</template>

<style scoped>
.breadcrumbs {
  display: flex;
  gap: var(--spacing-2);
  overflow: hidden;
  color: var(--color-text-muted);
  font-size: 0.875rem;
  white-space: nowrap;
}

.breadcrumbs a:hover {
  color: var(--color-text);
}

.breadcrumbs span:last-child {
  overflow: hidden;
  text-overflow: ellipsis;
}

.wallpaper {
  display: grid;
  gap: var(--spacing-6);
  align-items: start;
}

.wallpaper__preview {
  overflow: hidden;
  border-radius: var(--radius-lg);
  background: var(--color-surface);
  box-shadow: inset 0 0 0 1px var(--color-border);
}

.wallpaper__preview img {
  width: 100%;
  height: auto;
  max-height: 78vh;
  object-fit: contain;
  background: var(--color-surface);
}

.wallpaper__info {
  display: grid;
  gap: var(--spacing-4);
}

.wallpaper__title {
  font-size: clamp(1.5rem, 2.6vw, 2.25rem);
  line-height: 1.15;
  letter-spacing: -0.03em;
}

.wallpaper__description {
  color: var(--color-text-muted);
}

.facts {
  display: grid;
  gap: var(--spacing-2);
}

.facts__row {
  display: flex;
  justify-content: space-between;
  gap: var(--spacing-4);
  padding-bottom: var(--spacing-2);
  border-bottom: 1px solid var(--color-border);
  font-size: 0.9375rem;
}

.facts__row dt {
  color: var(--color-text-muted);
}

.facts__row dd {
  text-align: right;
}

.facts__row a {
  color: var(--color-accent);
}

.wallpaper__actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  flex-wrap: wrap;
}

.resolutions,
.tags {
  display: grid;
  gap: var(--spacing-3);
}

.resolutions__title {
  font-size: 1rem;
  font-weight: 600;
}

.resolutions__list {
  display: grid;
  gap: var(--spacing-2);
}

.resolution {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-4);
  padding: 10px 14px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-surface);
  font-size: 0.9375rem;
  transition: border-color var(--transition);
}

.resolution:hover {
  border-color: var(--color-accent);
}

.resolution__size {
  color: var(--color-text-muted);
  font-size: 0.875rem;
}

.loading-state {
  padding-block: var(--spacing-8);
  text-align: center;
}

@media (min-width: 1024px) {
  .wallpaper {
    grid-template-columns: minmax(0, 1.5fr) minmax(320px, 1fr);
  }
}
</style>
