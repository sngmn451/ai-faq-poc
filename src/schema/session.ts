import { text, integer, sqliteTable } from "drizzle-orm/sqlite-core"
import { nanoid } from "nanoid"

const EXPIRES = 1000 * 60 * 60 * 24 * 365 // 1 year
export const sessions = sqliteTable("sessions", {
  id: text("id").unique().$defaultFn(nanoid).notNull(),
  expires: integer("expires")
    .notNull()
    .$defaultFn(() => {
      return Date.now() + EXPIRES
    }),
})
