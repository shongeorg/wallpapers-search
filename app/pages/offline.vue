<script setup lang="ts">
useSeoMeta({
  title: 'Offline — Wallpaper Studio',
  robots: 'noindex, nofollow'
})
</script>

<template>
  <div class="container page">
    <section class="empty-state">
      <h1>You are offline</h1>
      <p>Previously opened pages and your favorites are still available.</p>
      <NuxtLink to="/" class="button">Try again</NuxtLink>
    </section>
  </div>
</template>
