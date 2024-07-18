import "dotenv/config"
import { migrate } from "drizzle-orm/libsql/migrator"
import { drizzle } from "drizzle-orm/libsql"
import { createClient } from "@libsql/client"

const client = createClient({
  url: process.env.DB_URL!,
  authToken: process.env.DB_AUTHTOKEN!,
})

export const db = drizzle(client)

async function main() {
  console.log(`Begins migration 🚧...`)
  await migrate(db, { migrationsFolder: "./migrations" })
  console.log(`Migration completed 🎉`)
  process.exit(0)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
