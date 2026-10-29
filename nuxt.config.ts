export default defineNuxtConfig({
  modules: [
    '@nuxt/icon/module',
    '@nuxt/image',
    '@bubblesortt/nuxt-es-toolkit',
    '@hypernym/nuxt-anime',
    '@nuxtjs/color-mode',
    '@nuxtjs/device',
    '@nuxtjs/google-fonts',
    '@nuxtjs/svg-sprite',
    '@pinia/nuxt',
    '@vite-pwa/nuxt'
  ],
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  components: [
    { path: '~/components', pathPrefix: false }
  ],
  css: [
    '~/assets/css/layers.css',
    '~/assets/css/variables.css',
    '~/assets/css/main.css'
  ],
  runtimeConfig: {
    unsplashApiKey: '',
    pexelsApiKey: '',
    pixabayApiKey: ''
  },
  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      title: 'Wallpaper Studio',
      meta: [
        { name: 'description', content: 'Search and download high resolution wallpapers for desktop, tablet and mobile.' },
        { name: 'theme-color', content: '#0b0b0d' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },
  image: {
    domains: ['images.unsplash.com', 'images.pexels.com', 'cdn.pixabay.com']
  },
  googleFonts: {
    families: {
      Inter: [400, 500, 600, 700]
    },
    display: 'swap'
  },
  colorMode: {
    preference: 'dark',
    fallback: 'dark',
    classSuffix: ''
  },
  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'Wallpaper Studio',
      short_name: 'Wallpapers',
      description: 'Search and download high resolution wallpapers.',
      theme_color: '#0b0b0d',
      background_color: '#0b0b0d',
      display: 'standalone',
      start_url: '/',
      icons: [
        {
          src: '/icons/icon.svg',
          sizes: 'any',
          type: 'image/svg+xml',
          purpose: 'any'
        }
      ]
    },
    workbox: {
      navigateFallback: '/offline',
      globPatterns: ['**/*.{js,css,html,svg,ico,woff2}']
    },
    devOptions: {
      enabled: false
    }
  },
  typescript: {
    strict: true
  }
})
