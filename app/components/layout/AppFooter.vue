<script setup lang="ts">
const year = new Date().getFullYear()
</script>

<template>
  <footer class="footer">
    <div class="container footer__inner">
      <div class="footer__brand">
        <span class="footer__mark" aria-hidden="true">W</span>
        <div>
          <p class="footer__title">Wallpaper Studio</p>
          <p class="footer__text">High resolution wallpapers for every screen.</p>
        </div>
      </div>
      <nav class="footer__links" aria-label="Footer navigation">
        <NuxtLink to="/">Home</NuxtLink>
        <NuxtLink to="/categories">Categories</NuxtLink>
        <NuxtLink to="/favorites">Favorites</NuxtLink>
        <NuxtLink to="/search?q=4k%20wallpaper">Search</NuxtLink>
      </nav>
      <p class="footer__note">Images are provided by Unsplash, Pexels and Pixabay under their licenses.</p>
      <p class="footer__note">© {{ year }} Wallpaper Studio</p>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  border-top: 1px solid var(--color-border);
  padding-block: var(--spacing-8);
  background: var(--color-surface);
}

.footer__inner {
  display: grid;
  gap: var(--spacing-4);
}

.footer__brand {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
}

.footer__mark {
  display: grid;
  width: 40px;
  height: 40px;
  place-items: center;
  border-radius: 12px;
  background: linear-gradient(140deg, var(--color-accent), #4c3fd6);
  color: #ffffff;
  font-weight: 700;
}

.footer__title {
  font-weight: 600;
}

.footer__text,
.footer__note {
  color: var(--color-text-muted);
  font-size: 0.875rem;
}

.footer__links {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-4);
  font-size: 0.9375rem;
}

.footer__links a {
  color: var(--color-text-muted);
  transition: color var(--transition);
}

.footer__links a:hover {
  color: var(--color-text);
}
</style>
