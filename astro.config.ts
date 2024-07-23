import { defineConfig } from "astro/config"
import react from "@astrojs/react"
import { TanStackRouterVite } from "@tanstack/router-plugin/vite"
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
      persist: {
        path: "./.cache/wrangler/v3",
      },
    },
  }),
  vite: {
    plugins: [
      TanStackRouterVite({
        routesDirectory: "./app/routes",
        generatedRouteTree: "./app/routeTree.gen.ts",
        quoteStyle: "double",
        semicolons: false,
      }),
    ],
    resolve: {
      alias: {
        net: "node:net",
        tls: "node:tls",
        http: "node:http",
      },
    },
  },
})
