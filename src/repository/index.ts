import type { ISessionRepository } from "./session/interface"
import { SessionSqliteRepository } from "./session/repository"

interface IRepository {
  session: ISessionRepository
}
export const Repo: IRepository = {
  session: new SessionSqliteRepository(),
}
