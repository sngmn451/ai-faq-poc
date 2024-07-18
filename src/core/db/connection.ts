import { drizzle } from "drizzle-orm/libsql"
import { createClient } from "@libsql/client"

const client = createClient({
  url: import.meta.env.DB_URL,
  authToken: import.meta.env.DB_AUTHTOKEN,
})

export const db = drizzle(client)
