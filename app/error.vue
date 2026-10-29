<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{
  error: NuxtError
}>()

function goHome() {
  clearError({ redirect: '/' })
}
</script>

<template>
  <div class="error-page container">
    <p class="error-page__code">{{ props.error.statusCode }}</p>
    <h1 class="error-page__title">{{ props.error.statusMessage || 'Something went wrong' }}</h1>
    <p class="muted">The page you are looking for is not available.</p>
    <button type="button" class="button button--accent" @click="goHome">Go home</button>
  </div>
</template>

<style scoped>
.error-page {
  display: grid;
  min-height: 70vh;
  place-content: center;
  justify-items: center;
  gap: var(--spacing-4);
  text-align: center;
}

.error-page__code {
  color: var(--color-accent);
  font-size: clamp(3rem, 10vw, 6rem);
  font-weight: 700;
  line-height: 1;
  letter-spacing: -0.05em;
}

.error-page__title {
  font-size: clamp(1.25rem, 3vw, 2rem);
}
</style>
