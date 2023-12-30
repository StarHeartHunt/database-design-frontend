import path from "node:path";
import url from "node:url";

import transformerDirectives from "@unocss/transformer-directives";
import vue from "@vitejs/plugin-vue";
import UnoCSS from "unocss/vite";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    UnoCSS({
      transformers: [transformerDirectives()],
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(
        path.dirname(url.fileURLToPath(import.meta.url)),
        "./src",
      ),
    },
  },
});
