import type { IBaseSqliteRepository } from "../base/sqlite.interface"

export interface ISessionRepository extends IBaseSqliteRepository<TSession> {
  generate(): Promise<TSession>
}
export type TSession = {
  id: string
  expires: Date
}
