import { defineConfig } from "astro/config"
import react from "@astrojs/react"

import tailwind from "@astrojs/tailwind"
import cloudflare from "@astrojs/cloudflare"

// https://astro.build/config
export default defineConfig({
  integrations: [
    react(),
    tailwind({
      applyBaseStyles: false,
    }),
  ],
  srcDir: "app",
  output: "server",
  adapter: cloudflare({
    platformProxy: {
      enabled: true,
      configPath: "wrangler.json",
      experimentalJsonConfig: true,
      persist: "./.cache/wrangler/v3",
    },
  }),
})
