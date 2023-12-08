import { createProPlugin, inputs } from "@formkit/pro";
import { defaultConfig } from "@formkit/vue";
import { genesisIcons } from "@formkit/icons";
import "@formkit/themes/genesis";
import "@formkit/pro/genesis";

// main.js or formkit.config.ts
const proPlugin = createProPlugin("fk-840f92caf18", inputs);

const config = defaultConfig({
  plugins: [proPlugin],
  icons: {
    ...genesisIcons,
  },
});

export default config;
