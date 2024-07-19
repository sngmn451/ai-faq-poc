import * as schema from "~/schema"
import { type IBaseSqliteRepository } from "./base/sqlite.interface"
import { BaseSqliteRepository } from "./base/sqlite.repository"

interface IRepository {
  chatroom: IBaseSqliteRepository<typeof schema.chatrooms>
  chatmessage: IBaseSqliteRepository<typeof schema.chatmessages>
  session: IBaseSqliteRepository<typeof schema.sessions>
}
export const Repo: IRepository = {
  chatroom: new BaseSqliteRepository(schema.chatrooms),
  chatmessage: new BaseSqliteRepository(schema.chatmessages),
  session: new BaseSqliteRepository(schema.sessions),
}
