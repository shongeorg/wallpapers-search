<script setup lang="ts">
const props = defineProps<{
  page: number
  hasMore: boolean
}>()

const route = useRoute()

const previousLink = computed(() => ({
  query: {
    ...route.query,
    page: props.page - 1 <= 1 ? undefined : props.page - 1
  }
}))

const nextLink = computed(() => ({
  query: {
    ...route.query,
    page: props.page + 1
  }
}))
</script>

<template>
  <nav v-if="page > 1 || hasMore" class="pagination" aria-label="Pagination">
    <NuxtLink v-if="page > 1" :to="previousLink" class="button">Previous</NuxtLink>
    <span class="pagination__status">Page {{ page }}</span>
    <NuxtLink v-if="hasMore" :to="nextLink" class="button">Next</NuxtLink>
  </nav>
</template>

<style scoped>
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-4);
  padding-top: var(--spacing-4);
}

.pagination__status {
  color: var(--color-text-muted);
  font-size: 0.875rem;
}
</style>
