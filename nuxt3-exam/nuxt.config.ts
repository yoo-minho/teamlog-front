import { JSDOM } from "jsdom";

const dom = new JSDOM(
  "<!DOCTYPE html><head></head><body><h1>FAKE DOM</h1></body></html>",
  {
    url: "https://example.org/",
    referrer: "https://example.com/",
    contentType: "text/html",
    includeNodeLocations: true,
    storageQuota: 10000000,
  }
);

const { XMLHttpRequest } = dom.window;
global.XMLHttpRequest = XMLHttpRequest;
// @ts-ignore
global.window = dom.window;
global.navigator = dom.window.navigator;
global.document = dom.window.document;
// @ts-ignore
global.FileList = dom.window.FileList;
global.File = dom.window.File;
global.getComputedStyle = dom.window.getComputedStyle;

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
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
    ],
    extras: {
      font: "roboto-font",
      fontIcons: ["material-icons"],
    },
    sassVariables: "@/assets/_colors.scss",
  },
  runtimeConfig: {
    apiSecret: "123",
    public: {
      apiBase: "/api",
    },
  },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "@/assets/_colors.scss" as *;',
        },
      },
    },
  },
});
