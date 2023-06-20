export default defineNuxtConfig({
  ssr: true,
  app: {
    head: {
      charset: "utf-8",
      viewport:
        "user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, width=device-width",
    },
    pageTransition: { name: "page", mode: "out-in" },
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
    includeAssets: ["favicon.ico", "favicon.svg"],
    manifest: {
      name: "teamlog",
      short_name: "teamlog",
      description:
        "티스토리, 미디엄, 브런치, 벨로그 상관없이 팀 블로그 만드는 방법",
      display: "standalone",
      theme_color: "#ffffff",
      background_color: "#ffffff",
      lang: "ko",
      icons: [
        {
          src: "pwa-192x192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "pwa-512x512.png",
          sizes: "512x512",
          type: "image/png",
        },
        {
          src: "pwa-512x512.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "any maskable",
        },
      ],
      orientation: "portrait",
    },
    client: {
      installPrompt: true,
      // you don't need to include this: only for testing purposes
      // if enabling periodic sync for update use 1 hour or so (periodicSyncForUpdates: 3600)
      // periodicSyncForUpdates: 20,
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
      apiBase: "http://localhost:5000/api/",
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
