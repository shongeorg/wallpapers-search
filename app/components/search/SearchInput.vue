<script setup lang="ts">
const props = withDefaults(defineProps<{
  modelValue: string
  placeholder?: string
  size?: 'md' | 'lg'
}>(), {
  placeholder: 'Search wallpapers',
  size: 'lg'
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'submit': [value: string]
}>()

const value = computed({
  get: () => props.modelValue,
  set: (next: string) => emit('update:modelValue', next)
})

function submit() {
  emit('submit', props.modelValue.trim())
}
</script>

<template>
  <form class="search" :class="`search--${size}`" role="search" @submit.prevent="submit">
    <svg class="search__icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.6-3.6" />
    </svg>
    <input
      v-model="value"
      type="search"
      name="q"
      :placeholder="placeholder"
      aria-label="Search wallpapers"
      enterkeyhint="search"
    >
    <button type="submit" class="button button--accent">Search</button>
  </form>
</template>

<style scoped>
.search {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  width: 100%;
  padding: 6px 6px 6px var(--spacing-4);
  border: 1px solid var(--color-border);
  border-radius: 999px;
  background: var(--color-surface);
  transition: border-color var(--transition);
}

.search:focus-within {
  border-color: var(--color-accent);
}

.search--lg {
  max-width: 720px;
  padding: 10px 10px 10px var(--spacing-6);
}

.search__icon {
  flex-shrink: 0;
  color: var(--color-text-muted);
}

.search input {
  flex: 1;
  min-width: 0;
  border: 0;
  background: transparent;
  font-size: 1rem;
  outline: none;
}

.search--lg input {
  font-size: 1.125rem;
}

@media (max-width: 560px) {
  .search .button {
    padding: 10px 14px;
  }
}
</style>
