import { defineConfig } from "drizzle-kit"

// @ts-ignore
const { DB_URL, DB_AUTHTOKEN } = process.env

export default defineConfig({
  schema: "./src/schema",
  out: "./migrations",
  dialect: "sqlite",
  driver: "turso",
  dbCredentials: {
    url: DB_URL!,
    authToken: DB_AUTHTOKEN!,
  },
  verbose: true,
  strict: true,
})
