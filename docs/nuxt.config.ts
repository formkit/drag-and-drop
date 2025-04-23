const title = "Drag & Drop • by FormKit";
const description =
  "An open-source JavaScript library for declarative data-first drag & drop.";

const storageConfig = process.env.KV_DRIVER
  ? {
      storage: {
        kv: {
          driver: process.env.KV_DRIVER,
          accountId: process.env.KV_ACCOUNT_ID,
          namespaceId: process.env.KV_NAMESPACE_ID,
          apiToken: process.env.KV_API_TOKEN,
        },
      },
    }
  : {};
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  css: ["@/assets/css/main.css"],

  devtools: {
    enabled: false,
  },

  experimental: {
    componentIslands: true,
  },

  runtimeConfig: {
    public: {
      includeStars: !!process.env.KV_DRIVER,
    },
  },

  components: [
    {
      path: "~/components",
    },
  ],

  modules: [
    "@nuxtjs/tailwindcss",
    "@vueuse/nuxt",
    "@nuxtjs/color-mode",
    "nuxt-fathom",
  ],

  fathom: {
    siteId: "KRFNTIEB",
  },

  app: {
    head: {
      title,
      htmlAttrs: {
        lang: "en",
      },
      link: [{ rel: "icon", type: "image/png", href: "/favicon.png" }],
      meta: [
        {
          name: "description",
          content: description,
        },
        {
          name: "og:title",
          content: title,
        },
        {
          name: "og:description",
          content: description,
        },
        {
          name: "og:image",
          content: "https://drag-and-drop.formkit.com/og.png",
        },
        {
          name: "og:url",
          content: "https://drag-and-drop.formkit.com",
        },
        {
          name: "twitter:card",
          content: "summary_large_image",
        },
        {
          name: "twitter:site",
          content: "https://drag-and-drop.formkit.com",
        },
        {
          name: "twitter:creator",
          content: "@formkit",
        },
        {
          name: "twitter:title",
          content: title,
        },
        {
          name: "twitter:description",
          content: description,
        },
        {
          name: "twitter:image",
          content: "https://drag-and-drop.formkit.com/og.png",
        },
      ],
    },
  },

  tailwindcss: {
    config: {
      darkMode: "class",
    },
  },

  colorMode: {
    classSuffix: "",
    storageKey: "dnd-color-mode",
  },

  routeRules: {
    "/": { prerender: true },
  },

  nitro: storageConfig,
  compatibilityDate: "2024-09-30",

  vite: {
    server: {
      hmr: {
        protocol: "wss",
        host: "localhost",
      },
      allowedHosts: true,
    },
  },
});
