import type { TSession } from "./interface"
import type { ISessionRepository } from "./interface"
import { BaseSqliteRepository } from "../base/sqlite.repository"

export class SessionSqliteRepository extends BaseSqliteRepository<TSession> implements ISessionRepository {
  async generate(): Promise<TSession> {
    const session = await this.db.insert(this.schema.sessions).values({}).returning()
    return {
      id: session[0].id,
      expires: new Date(session[0].expires),
    }
  }
}
