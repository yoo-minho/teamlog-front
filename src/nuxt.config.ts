export default defineNuxtConfig({
  ssr: true,
  app: {
    head: {
      htmlAttrs: { lang: "ko" },
      charset: "utf-8",
      viewport:
        "user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, width=device-width",
    },
  },
  extends: ["nuxt-seo-kit"],
  modules: ["nuxt-quasar-ui", "@pinia/nuxt", "@vite-pwa/nuxt", "nuxt-gtag"],
  gtag: {
    id: "G-MRERLPYY1H",
  },
  pwa: {
    registerType: "autoUpdate",
    injectRegister: "auto", //default
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
          src: "assets/icons/icon-192x192.png",
          sizes: "192x192",
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
      installPrompt: true,
      periodicSyncForUpdates: 20,
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
      language: "ko",
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
  nitro: {
    prerender: {
      crawlLinks: true,
      failOnError: false,
    },
  },
});
