import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import node from "@astrojs/node";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  devToolbar: {
    enabled: false,
  },

  output: "static",

  adapter: node({
    mode: "standalone",
  }),

  integrations: [react()],

  prefetch: {
    prefetchAll: false,
    defaultStrategy: "hover",
  },

  compressHTML: true,

  vite: {
    plugins: [tailwindcss()],
  },
});
