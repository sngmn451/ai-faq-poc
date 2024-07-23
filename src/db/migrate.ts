import { migrate } from "drizzle-orm/libsql/migrator"
import { db } from "./connection"

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
