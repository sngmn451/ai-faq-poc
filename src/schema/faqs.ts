import { text, integer, sqliteTable } from "drizzle-orm/sqlite-core"

export const faqs = sqliteTable("faqs", {
  id: integer("id").unique().primaryKey({ autoIncrement: true }),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  embedding: text("embedding", { mode: "json" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  deletedAt: integer("deleted_at", { mode: "timestamp" }),
})
