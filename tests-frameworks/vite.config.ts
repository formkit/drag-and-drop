import { defineConfig } from "vite";

import vue from "@vitejs/plugin-vue";

import react from "@vitejs/plugin-react";

import solid from "vite-plugin-solid";

import marko from "@marko/vite";

import { svelte } from "@sveltejs/vite-plugin-svelte";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    react({
      include: "./react/**/*.tsx",
    }),
    solid({
      include: "./solid/**/*.tsx",
    }),
    marko({ linked: false }),
    svelte({ include: ["./svelte/**/*.svelte"] }),
  ],
});
