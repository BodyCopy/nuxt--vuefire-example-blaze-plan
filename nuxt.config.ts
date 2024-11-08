export default defineNuxtConfig({
  // Having SSR allows us to use `nuxt generate`, turn it off if you don't care
  ssr: true,

  devtools: { enabled: false },

  app: {
    head: {
      title: 'Miss.Bingo',
      meta: [
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' }
      ],
      link: [
        // {
        //   href: 'https://cdn.jsdelivr.net/npm/water.css@2/out/water.css',
        //   rel: 'stylesheet',
        // },
        {
          rel: 'icon',
          type: 'image/svg+xml',
          href: '/MissBingoLogo.svg',
        },
      ],
    },
  },
  plugins: [
    '~/plugins/tooltip.js'
  ],
  css: ['~/assets/main.scss'],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler', // or "modern", "legacy"
        }
      }
    }
  },
  components: {
    dirs: [
      {
        path: '~/components',
        pathPrefix: false // Disable prefix for all subdirectories
      }
    ]
  },

  nitro: {
    prerender: {
      // these routes are not dependent on any data and can be prerendered
      // it's a good idea to pre render all routes that you can
      // routes: ['/', '/analytics'],
    },
    preset: 'firebase',

    // for the upcoming preset
    firebase: {
      gen: 2,
      nodeVersion: '18',
    },
  },

  modules: ['nuxt-vuefire', '@vueuse/nuxt', '@pinia/nuxt'],

  vuefire: {
    emulators: {
      // uncomment this line to run the application in production mode without emulators during dev
      // enabled: false,
      auth: {
        options: {
          disableWarnings: true,
        },
      },
    },
    auth: true,

    // appCheck: {
    //   provider: 'ReCaptchaV3',
    //   // site key, NOT secret key
    //   key: '6LeS5q0nAAAAABH3u13ntLwuIOkiNjHlXJOXoN5T',
    //   isTokenAutoRefreshEnabled: true,
    // },


    config: {
      apiKey: "AIzaSyDCrXmbdauNPNl0IY7uUdkuSjY7CLs9yIA",

      authDomain: "miss-bingo.firebaseapp.com",

      databaseURL: "https://miss-bingo-default-rtdb.firebaseio.com",

      projectId: "miss-bingo",

      storageBucket: "miss-bingo.appspot.com",

      messagingSenderId: "70817967508",

      appId: "1:70817967508:web:1267ef06696f7045767381"

    },
  },

  experimental: {
    payloadExtraction: false,
  },

  // Customize this to your needs and try to server side render only what is needed
  // https://nuxt.com/docs/guide/concepts/rendering#hybrid-rendering
  routeRules: {
    // Make some pages client only (since we have an SPA)
    // useful for authenticated pages that require the user to be logged in to be
    // displayed
    '/': { ssr: false },
    '/admin': { ssr: false },
    '/login': { ssr: false },
    '/analytics': { ssr: true },
    // you don't need to add ssr: true to any route, it's the default
    '/users': { ssr: true },
    '/posts/new': { ssr: true },
    '/bingoCards/bingo-card-creator': { isr: 3600 },
    '/rooms/**': { ssr: false },
    '/profile/**': { isr: 3600 },
    // '/emoji-panel': { swr: true },
  },

  compatibilityDate: '2024-09-03',
})