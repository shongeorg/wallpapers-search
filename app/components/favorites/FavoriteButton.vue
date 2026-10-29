<script setup lang="ts">
import type { WallpaperSummary } from '#shared/types/wallpaper'

const props = withDefaults(defineProps<{
  wallpaper: WallpaperSummary
  size?: 'sm' | 'md'
}>(), {
  size: 'md'
})

const { isFavorite, toggle } = useFavorites()

const active = computed(() => isFavorite(props.wallpaper.id))

function onClick() {
  toggle(props.wallpaper)
}
</script>

<template>
  <button
    type="button"
    class="favorite"
    :class="[`favorite--${size}`, { 'is-active': active }]"
    :aria-pressed="active"
    :aria-label="active ? 'Remove from favorites' : 'Add to favorites'"
    @click.prevent.stop="onClick"
  >
    <svg viewBox="0 0 24 24" width="18" height="18" :fill="active ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M12 20.5 4.8 13.3a4.6 4.6 0 0 1 6.5-6.5l.7.7.7-.7a4.6 4.6 0 0 1 6.5 6.5Z" />
    </svg>
  </button>
</template>

<style scoped>
.favorite {
  display: grid;
  place-items: center;
  border: 1px solid var(--color-border);
  border-radius: 50%;
  background: color-mix(in srgb, var(--color-background) 70%, transparent);
  color: var(--color-text);
  cursor: pointer;
  transition: color var(--transition), border-color var(--transition), transform var(--transition);
}

.favorite:hover {
  transform: scale(1.06);
  border-color: var(--color-accent);
}

.favorite.is-active {
  color: var(--color-danger);
  border-color: var(--color-danger);
}

.favorite--sm {
  width: 34px;
  height: 34px;
}

.favorite--md {
  width: 44px;
  height: 44px;
}
</style>
