import type { SQLiteTable } from "drizzle-orm/sqlite-core"
import type { TQueryOption } from "~/interface/query-options"

export interface IBaseSqliteRepository<Model extends SQLiteTable = SQLiteTable> {
  Connection(): Promise<boolean>
  Count(options?: TQueryOption): Promise<number>
  FindOneById(id: any): Promise<Model["$inferSelect"] | undefined>
  FindLast(): Promise<Model["$inferSelect"] | undefined>
  FindAll(options?: TQueryOption): Promise<Model["$inferSelect"][]>
  Create(data: Model["$inferInsert"]): Promise<Model["$inferSelect"] | any>
  Update(id: any, data: Model["$inferInsert"]): Promise<Model["$inferSelect"] | any>
}
