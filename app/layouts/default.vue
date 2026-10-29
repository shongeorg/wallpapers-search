<template>
  <div class="layout">
    <AppHeader />
    <main class="layout__main">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>

<style scoped>
.layout {
  display: flex;
  min-height: 100vh;
  flex-direction: column;
}

.layout__main {
  flex: 1;
}
</style>
