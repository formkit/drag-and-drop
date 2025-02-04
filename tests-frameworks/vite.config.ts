import { defineConfig } from "vite";

import vue from "@vitejs/plugin-vue";

import react from "@vitejs/plugin-react";

import solid from "vite-plugin-solid";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), react(), solid()],
});
