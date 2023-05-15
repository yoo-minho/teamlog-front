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
  modules: ["nuxt-quasar-ui", "@pinia/nuxt"],
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
