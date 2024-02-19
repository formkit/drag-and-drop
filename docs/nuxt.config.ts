const title = "Drag & Drop • by FormKit";
const description =
  "An open-source JavaScript library for declarative data-first drag & drop.";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  css: ["@/assets/css/main.css"],
  experimental: {
    componentIslands: true,
  },
  modules: [
    "@nuxtjs/tailwindcss",
    "@vueuse/nuxt",
    "@nuxtjs/color-mode",
    "nuxt-fathom",
    // "nuxt-shiki",
  ],
  // shiki: {
  //   theme: "github-light",
  //   lang: "typescript",
  // },
  fathom: {
    siteId: "",
  },
  app: {
    head: {
      title,
      htmlAttrs: {
        lang: "en",
      },
      link: [],
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
      theme: {
        fontFamily: {
          mono: ["Menlo", "Monaco", "monospace"],
        },
      },
    },
  },
  colorMode: {
    classSuffix: "",
    storageKey: "dnd-color-mode",
  },
});
