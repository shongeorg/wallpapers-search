<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const colorMode = useColorMode()
const isMenuOpen = ref(false)
const searchTerm = ref('')
const isDark = computed(() => colorMode.value !== 'light')
const { hasPrompt, isInstalled, install } = usePwaInstall()
const isInstallHintOpen = ref(false)

async function handleInstall() {
  if (hasPrompt.value) {
    await install()
    isInstallHintOpen.value = false
    return
  }

  isInstallHintOpen.value = !isInstallHintOpen.value
}

function toggleTheme() {
  colorMode.preference = isDark.value ? 'light' : 'dark'
}

function submitSearch() {
  const query = searchTerm.value.trim()
  router.push({ path: '/search', query: query ? { q: query } : {} })
  isMenuOpen.value = false
}

watch(() => route.fullPath, () => {
  isMenuOpen.value = false
  isInstallHintOpen.value = false
})
</script>

<template>
  <header class="header">
    <div class="container header__inner">
      <NuxtLink to="/" class="brand" aria-label="Wallpaper Studio home">
        <span class="brand__mark" aria-hidden="true">W</span>
        <span class="brand__name">Wallpaper Studio</span>
      </NuxtLink>

      <nav class="header__nav" :class="{ 'is-open': isMenuOpen }" aria-label="Main navigation">
        <NuxtLink to="/" class="header__link">Home</NuxtLink>
        <NuxtLink to="/categories" class="header__link">Categories</NuxtLink>
        <NuxtLink to="/favorites" class="header__link">Favorites</NuxtLink>
      </nav>

      <form class="header__search" role="search" @submit.prevent="submitSearch">
        <input
          v-model="searchTerm"
          type="search"
          name="q"
          placeholder="Search wallpapers"
          aria-label="Search wallpapers"
          enterkeyhint="search"
        >
        <button type="submit" class="header__search-button" aria-label="Search">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.6-3.6" />
          </svg>
        </button>
      </form>

      <div class="header__actions">
        <div v-if="!isInstalled" class="header__install">
          <button
            type="button"
            class="icon-button"
            aria-label="Install app"
            title="Install app"
            :aria-expanded="isInstallHintOpen"
            @click="handleInstall"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M12 4v10m0 0 4-4m-4 4-4-4M5 19h14" />
            </svg>
          </button>
          <div v-if="isInstallHintOpen" class="install-hint" role="status">
            <p class="install-hint__title">Install Wallpaper Studio</p>
            <p class="install-hint__text">Open the browser menu and choose “Install app” or “Add to Home Screen”.</p>
          </div>
        </div>
        <button
          type="button"
          class="icon-button"
          :aria-label="isDark ? 'Switch to light theme' : 'Switch to dark theme'"
          @click="toggleTheme"
        >
          <svg v-if="isDark" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
          </svg>
          <svg v-else viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true">
            <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5Z" />
          </svg>
        </button>
        <button
          type="button"
          class="icon-button header__menu"
          :aria-expanded="isMenuOpen"
          aria-label="Toggle navigation"
          @click="isMenuOpen = !isMenuOpen"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true">
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>
      </div>
    </div>
  </header>
</template>

<style scoped>
.header {
  position: sticky;
  top: 0;
  z-index: 20;
  border-bottom: 1px solid var(--color-border);
  background: color-mix(in srgb, var(--color-background) 88%, transparent);
  backdrop-filter: blur(14px);
}

.header__inner {
  display: flex;
  align-items: center;
  gap: var(--spacing-4);
  min-height: var(--header-height);
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-2);
  font-weight: 700;
  letter-spacing: -0.02em;
  white-space: nowrap;
}

.brand__mark {
  display: grid;
  width: 32px;
  height: 32px;
  place-items: center;
  border-radius: 10px;
  background: linear-gradient(140deg, var(--color-accent), #4c3fd6);
  color: #ffffff;
  font-size: 0.9375rem;
}

.brand__name {
  font-size: 1rem;
}

.header__nav {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
}

.header__link {
  padding: 8px 12px;
  border-radius: 999px;
  color: var(--color-text-muted);
  font-size: 0.9375rem;
  transition: color var(--transition), background var(--transition);
}

.header__link:hover,
.header__link.router-link-active {
  color: var(--color-text);
  background: var(--color-surface);
}

.header__search {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-left: auto;
  padding: 4px 4px 4px 14px;
  border: 1px solid var(--color-border);
  border-radius: 999px;
  background: var(--color-surface);
}

.header__search input {
  width: clamp(120px, 18vw, 240px);
  border: 0;
  background: transparent;
  font-size: 0.875rem;
  outline: none;
}

.header__search-button {
  display: grid;
  width: 32px;
  height: 32px;
  place-items: center;
  border: 0;
  border-radius: 50%;
  background: var(--color-accent);
  color: #ffffff;
  cursor: pointer;
}

.header__actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
}

.icon-button {
  display: grid;
  width: 38px;
  height: 38px;
  place-items: center;
  border: 1px solid var(--color-border);
  border-radius: 50%;
  background: var(--color-surface);
  color: var(--color-text);
  cursor: pointer;
  transition: border-color var(--transition), background var(--transition);
}

.icon-button:hover {
  border-color: var(--color-accent);
  background: var(--color-surface-hover);
}

.header__menu {
  display: none;
}

.header__install {
  position: relative;
}

.install-hint {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  z-index: 30;
  width: 260px;
  padding: var(--spacing-3) var(--spacing-4);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-surface);
  box-shadow: 0 16px 40px rgb(0 0 0 / 45%);
}

.install-hint__title {
  margin-bottom: 4px;
  font-size: 0.875rem;
  font-weight: 600;
}

.install-hint__text {
  color: var(--color-text-muted);
  font-size: 0.8125rem;
  line-height: 1.45;
}

@media (max-width: 900px) {
  .header__nav {
    position: absolute;
    top: calc(100% + 1px);
    left: 0;
    right: 0;
    display: none;
    flex-direction: column;
    align-items: stretch;
    gap: 0;
    padding: var(--spacing-2) var(--spacing-4) var(--spacing-4);
    border-bottom: 1px solid var(--color-border);
    background: var(--color-background);
  }

  .header__nav.is-open {
    display: flex;
  }

  .header__link {
    padding: 12px;
  }

  .header__menu {
    display: grid;
  }

  .header__search {
    flex: 1;
    margin-left: 0;
  }

  .header__search input {
    width: 100%;
  }
}

@media (max-width: 560px) {
  .brand__name {
    display: none;
  }
}
</style>
