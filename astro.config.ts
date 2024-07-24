import { defineConfig } from "astro/config"
import react from "@astrojs/react"
import { TanStackRouterVite } from "@tanstack/router-plugin/vite"
import tailwind from "@astrojs/tailwind"
import { nodePolyfills } from "vite-plugin-node-polyfills"
import netlify from "@astrojs/netlify"

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
  adapter: netlify(),
  vite: {
    plugins: [
      TanStackRouterVite({
        routesDirectory: "./app/routes",
        generatedRouteTree: "./app/routeTree.gen.ts",
        quoteStyle: "double",
        semicolons: false,
      }),
      nodePolyfills(),
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
      minify: false,
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
    define: {
      "process.env.DB_URL": JSON.stringify(process.env.DB_URL),
      "process.env.DB_AUTHTOKEN": JSON.stringify(process.env.DB_AUTHTOKEN),
      "process.env.OPENAI_KEY": JSON.stringify(process.env.OPENAI_KEY),
      "process.env.OPENAI_PROJECT_ID": JSON.stringify(process.env.OPENAI_PROJECT_ID),
      "process.env.OPENAI_ORG_ID": JSON.stringify(process.env.OPENAI_ORG_ID),
      "process.env.GCT_CREDENTIAL": JSON.stringify(process.env.GCT_CREDENTIAL),
    },
  },
})