import { text, integer, sqliteTable, index } from "drizzle-orm/sqlite-core"
import { chatrooms } from "./chat-room"
import { sessions } from "./session"

export const chatmessages = sqliteTable(
  "chatmessages",
  {
    id: integer("id").unique().primaryKey({ autoIncrement: true }),
    source: text("source", {
      enum: ["human", "ai"],
    }).notNull(),
    chatroomId: integer("chatroom_id")
      .notNull()
      .references(() => chatrooms.id),
    message: text("message"),
    sessionId: text("session_id").references(() => sessions.id),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date()),
    updatedAt: integer("updated_at", { mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date()),
    deletedAt: integer("deleted_at", { mode: "timestamp" }),
  },
  (column) => ({
    idxSessionId: index("idxChatmessagesSessionId").on(column.id, column.sessionId),
  })
)
