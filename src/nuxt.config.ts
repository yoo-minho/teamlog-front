export default defineNuxtConfig({
  ssr: true,
  app: {
    head: {
      charset: "utf-8",
      viewport:
        "user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, width=device-width",
    },
  },
  modules: ["nuxt-quasar-ui", "@pinia/nuxt", "@vite-pwa/nuxt"],
  pwa: {
    // registerWebManifestInRouteRules: true,
    registerType: "autoUpdate",
    injectRegister: "auto", //default
    workbox: {
      globPatterns: ["**/*.{ico}"],
      // globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
      cleanupOutdatedCaches: true,
    },
    includeAssets: ["favicon.ico"],
    manifest: {
      name: "teamlog",
      short_name: "teamlog",
      description:
        "티스토리, 미디엄, 브런치, 벨로그 상관없이 팀 블로그 만드는 방법",
      display: "standalone",
      theme_color: "#ffffff",
      background_color: "#ffffff",
      start_url: ".",
      lang: "ko",
      icons: [
        {
          src: "assets/icons/icon-72x72.png",
          sizes: "72x72",
          type: "image/png",
          purpose: "maskable any",
        },
        {
          src: "assets/icons/icon-96x96.png",
          sizes: "96x96",
          type: "image/png",
          purpose: "maskable any",
        },
        {
          src: "assets/icons/icon-128x128.png",
          sizes: "128x128",
          type: "image/png",
          purpose: "maskable any",
        },
        {
          src: "assets/icons/icon-144x144.png",
          sizes: "144x144",
          type: "image/png",
          purpose: "maskable any",
        },
        {
          src: "assets/icons/icon-152x152.png",
          sizes: "152x152",
          type: "image/png",
          purpose: "maskable any",
        },
        {
          src: "assets/icons/icon-192x192.png",
          sizes: "192x192",
          type: "image/png",
          purpose: "maskable any",
        },
        {
          src: "assets/icons/icon-384x384.png",
          sizes: "384x384",
          type: "image/png",
          purpose: "maskable any",
        },
        {
          src: "assets/icons/icon-512x512.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "maskable any",
        },
      ],
      orientation: "portrait",
    },
    client: {
      registerPlugin: true,
      installPrompt: true,
      // you don't need to include this: only for testing purposes
      // if enabling periodic sync for update use 1 hour or so (periodicSyncForUpdates: 3600)
      periodicSyncForUpdates: 5,
    },
  },
  quasar: {
    plugins: [
      "BottomSheet",
      "Dialog",
      "Loading",
      "LoadingBar",
      "Notify",
      "Dark",
      "LocalStorage",
    ],
    extras: {
      fontIcons: ["material-icons"],
    },
    sassVariables: "@/assets/global.scss",
  },
  runtimeConfig: {
    public: {
      apiBase: {
        dev: "http://localhost:5000/api/",
        prod: "https://teamlog.team/api/",
      },
    },
  },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "@/assets/global.scss" as *;',
        },
      },
    },
  },
});
