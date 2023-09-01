import { compression } from "vite-plugin-compression2";

export default defineNuxtConfig({
  ssr: true,
  app: {
    head: {
      htmlAttrs: { lang: "ko" },
      charset: "utf-8",
      viewport:
        "user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, width=device-width",
      link: [
        { rel: "icon", type: "image/png", href: "favicon.ico" },
        { rel: "apple-touch-icon", href: "og-image.png" },
        {
          rel: "preload",
          as: "font",
          href: "/assets/fonts/Pretendard-Regular.woff2",
          crossorigin: "anonymous",
        },
        {
          rel: "preload",
          as: "font",
          href: "/assets/fonts/Pretendard-Regular.woff",
          crossorigin: "anonymous",
        },
        {
          rel: "preload",
          as: "font",
          href: "/assets/fonts/Pretendard-Regular.ttf",
          crossorigin: "anonymous",
        },
      ],
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
      siteUrl: "https://teamlog.team",
      trailingSlash: true,
      titleSeparator: "",
      siteName: " ",
      siteDescription:
        "맘에 드는 블로그 모으니 팀 블로그가 되었네! 티스토리, 벨로그, 브런치, 미디엄, 네이버블로그, 유튜브 상관없이 팀 블로그 만드는 방법",
      language: "ko",
    },
  },
  vite: {
    root: "@",
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "@/assets/global.scss" as *;',
        },
      },
    },
    plugins: [compression()],
  },
  nitro: {
    prerender: {
      crawlLinks: false,
      failOnError: false,
    },
  },
});
