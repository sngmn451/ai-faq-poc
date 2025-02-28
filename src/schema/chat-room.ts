import { text, integer, sqliteTable, index } from "drizzle-orm/sqlite-core"
import { nanoid } from "nanoid"
import { sessions } from "./session"

export const chatrooms = sqliteTable(
  "chatrooms",
  {
    id: integer("id").unique().primaryKey({ autoIncrement: true }),
    key: text("key").unique().$defaultFn(nanoid).notNull(),
    name: text("name").notNull(),
    sessionId: text("session_id")
      .notNull()
      .references(() => sessions.id),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date()),
    updatedAt: integer("updated_at", { mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date()),
    deletedAt: integer("deleted_at", { mode: "timestamp" }),
  },
  (column) => ({
    idxSessionId: index("idxChatroomSessionId").on(column.id, column.sessionId),
    keySessionId: index("keyChatroomSessionId").on(column.key, column.sessionId),
  }),
)
