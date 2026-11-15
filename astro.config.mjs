// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import node from "@astrojs/node";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  devToolbar: {
    enabled: false,
  },

  site: "https://revistamicelio.cl",
  output: "static",

  adapter: node({
    mode: "standalone",
  }),

  integrations: [
    react(),
    sitemap({
      filter: (page) =>
        !["/carrito", "/cuenta", "/terminos", "/privacidad", "/404"].some(
          (path) => page.includes(path),
        ),
    }),
  ],

  prefetch: {
    prefetchAll: true,
    defaultStrategy: "viewport",
  },

  compressHTML: true,

  vite: {
    plugins: [tailwindcss()],
  },
});
