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
  routeRules: {
    '/offline': { prerender: true }
  },
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
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'manifest', href: '/manifest.webmanifest' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/icons/apple-touch-icon.png' }
      ],
      script: [
        {
          innerHTML: "window.__pwaInstallPrompt=null;window.addEventListener('beforeinstallprompt',function(e){e.preventDefault();window.__pwaInstallPrompt=e;});"
        }
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
      id: '/',
      name: 'Wallpaper Studio',
      short_name: 'Wallpapers',
      description: 'Search and download high resolution wallpapers for desktop, tablet and mobile.',
      lang: 'en',
      dir: 'ltr',
      theme_color: '#0b0b0d',
      background_color: '#0b0b0d',
      display: 'standalone',
      display_override: ['standalone', 'minimal-ui'],
      orientation: 'any',
      scope: '/',
      start_url: '/',
      categories: ['photo', 'lifestyle', 'entertainment'],
      icons: [
        {
          src: '/icons/icon.svg',
          sizes: 'any',
          type: 'image/svg+xml',
          purpose: 'any'
        },
        {
          src: '/icons/icon-192.png',
          sizes: '192x192',
          type: 'image/png',
          purpose: 'any'
        },
        {
          src: '/icons/icon-512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any'
        },
        {
          src: '/icons/maskable-512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable'
        }
      ],
      shortcuts: [
        {
          name: 'Favorites',
          short_name: 'Favorites',
          url: '/favorites',
          icons: [{ src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' }]
        },
        {
          name: 'Categories',
          short_name: 'Categories',
          url: '/categories',
          icons: [{ src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' }]
        },
        {
          name: 'Search',
          short_name: 'Search',
          url: '/search',
          icons: [{ src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' }]
        }
      ]
    },
    workbox: {
      navigateFallback: null,
      globPatterns: ['**/*.{js,css,html,svg,ico,png,woff2}'],
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/(images\.unsplash\.com|images\.pexels\.com|cdn\.pixabay\.com)\//,
          handler: 'CacheFirst',
          options: {
            cacheName: 'wallpaper-images',
            expiration: {
              maxEntries: 300,
              maxAgeSeconds: 60 * 60 * 24 * 30
            },
            cacheableResponse: { statuses: [0, 200] }
          }
        },
        {
          urlPattern: /^https?:\/\/[^/]+\/api\/wallpapers\//,
          handler: 'NetworkFirst',
          options: {
            cacheName: 'wallpaper-api',
            networkTimeoutSeconds: 5,
            expiration: {
              maxEntries: 100,
              maxAgeSeconds: 60 * 60 * 24 * 7
            },
            cacheableResponse: { statuses: [200] }
          }
        }
      ]
    },
    devOptions: {
      enabled: false
    }
  },
  typescript: {
    strict: true
  }
})
