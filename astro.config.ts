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
  adapter: cloudflare(),
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
        crypto: "node:crypto",
        dns: "node:dns",
        fs: "node:fs",
        net: "node:net",
        tls: "node:tls",
        http: "node:http",
        https: "node:https",
        events: "node:events",
        os: "node:os",
        path: "node:path",
        stream: "node:stream",
        string_decoder: "node:string_decoder",
        url: "node:url",
        util: "node:util",
      },
    },
    build: {
      rollupOptions: {
        external: [
          "cloudflare:sockets",
          "node:crypto",
          "node:dns",
          "node:fs",
          "node:net",
          "node:tls",
          "node:http",
          "node:https",
          "node:events",
          "node:os",
          "node:path",
          "node:stream",
          "node:string_decoder",
          "node:url",
          "node:util",
        ],
      },
    },
  },
})
