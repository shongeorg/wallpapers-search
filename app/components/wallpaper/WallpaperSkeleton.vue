<template>
  <div class="skeleton" aria-hidden="true">
    <div class="skeleton__media" />
    <div class="skeleton__line" />
    <div class="skeleton__line skeleton__line--short" />
  </div>
</template>

<style scoped>
.skeleton {
  display: grid;
  gap: var(--spacing-2);
}

.skeleton__media {
  aspect-ratio: 4 / 3;
  border-radius: var(--radius-md);
  background: var(--color-surface);
  animation: pulse 1.4s ease-in-out infinite;
}

.skeleton__line {
  height: 12px;
  border-radius: 999px;
  background: var(--color-surface);
  animation: pulse 1.4s ease-in-out infinite;
}

.skeleton__line--short {
  width: 55%;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 0.55;
  }

  50% {
    opacity: 1;
  }
}
</style>
