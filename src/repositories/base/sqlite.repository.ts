import type { IBaseSqliteRepository } from "./sqlite.interface"
import { db } from "~/db/connection"
import * as schema from "~/schema"
import { desc, eq, sql } from "drizzle-orm"
import type { SQLiteTable } from "drizzle-orm/sqlite-core"
import type { TQueryOption } from "~/interface/query-options"
import { DEFAULT_LIMIT, DEFAULT_OFFSET } from "~/config/query-options"

export class BaseSqliteRepository<Model extends SQLiteTable & { id: any }> implements IBaseSqliteRepository<Model> {
  db = db
  schema = schema
  model: Model
  constructor(model: Model) {
    this.model = model
  }
  async Connection(): Promise<boolean> {
    try {
      await this.db.run(sql`SELECT 1+1 AS result`)
      return true
    } catch {
      return false
    }
  }
  async Count(options?: TQueryOption) {
    const result = await this.db
      .select({ count: sql<number>`COUNT(*)` })
      .from(this.model)
      .where(options?.where ?? options?.where)

    return result.at(0)!.count
  }
  async FindOneById(id: any) {
    const result = await this.db.select().from(this.model).where(eq(this.model.id, id)).limit(1)
    return result.at(0)!
  }
  async FindLast() {
    const result = await this.db.select().from(this.model).orderBy(desc(this.model.id)).limit(1)
    return result.at(0)!
  }
  async FindAll(options?: TQueryOption) {
    const result = await this.db
      .select()
      .from(this.model)
      .where(options?.where ?? options?.where)
      .limit(options?.limit || DEFAULT_LIMIT)
      .offset(options?.offset || DEFAULT_OFFSET)
      .orderBy(
        Array.isArray(options?.orderBy) && options?.orderBy?.length! > 1
          ? sql.raw(options?.orderBy?.map((order) => `${order.id} ${order.desc ? "DESC" : "ASC"}`).join(","))
          : desc(this.model.id),
      )
    return result
  }
  async Create(data: Model["$inferInsert"]) {
    const result = await this.db.insert(this.model).values(data).returning()
    return result.at(0)!
  }
  async Update(id: any, data: Model["$inferInsert"]) {
    const result = await this.db.update(this.model).set(data).where(eq(this.model.id, id)).returning()
    return result.at(0)!
  }
}
