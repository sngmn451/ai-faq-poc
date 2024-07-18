import type { LibSQLDatabase } from "drizzle-orm/libsql"
import type { IBaseSqliteRepository } from "./sqlite.interface"
import { db } from "~/core/db/connection"
import * as schema from "~/core/schema"
import { sql } from "drizzle-orm"

export class BaseSqliteRepository<T> implements IBaseSqliteRepository<T> {
  db = db
  schema = schema
  async testConnection(): Promise<boolean> {
    try {
      await await this.db.run(sql`SELECT 1+1 AS result`)
      return true
    } catch {
      return false
    }
  }
  async create(item: T): Promise<T> {
    throw new Error("Method not implemented.")
  }
  async update(id: string, item: T): Promise<T> {
    throw new Error("Method not implemented.")
  }
  async delete(id: string): Promise<void> {
    throw new Error("Method not implemented.")
  }
  async get(id: string): Promise<T | undefined> {
    throw new Error("Method not implemented.")
  }
  async getAll(): Promise<T[]> {
    throw new Error("Method not implemented.")
  }
  async getMany(ids: string[]): Promise<T[]> {
    throw new Error("Method not implemented.")
  }
}
