import * as schema from "~/schema"
import { type IBaseSqliteRepository } from "./base/sqlite.interface"
import { BaseSqliteRepository } from "./base/sqlite.repository"
import { OpenAIFaqsRepository } from "./faqs/openai.repository"
import type { IOpenAIFaqsRepository } from "./faqs/interface"

interface IRepository {
  chatroom: IBaseSqliteRepository<typeof schema.chatrooms>
  chatmessage: IBaseSqliteRepository<typeof schema.chatmessages>
  session: IBaseSqliteRepository<typeof schema.sessions>
  faq: IBaseSqliteRepository<typeof schema.faqs>
  aifaq: IOpenAIFaqsRepository
}
export const Repo: IRepository = {
  chatroom: new BaseSqliteRepository(schema.chatrooms),
  chatmessage: new BaseSqliteRepository(schema.chatmessages),
  session: new BaseSqliteRepository(schema.sessions),
  faq: new BaseSqliteRepository(schema.faqs),
  aifaq: new OpenAIFaqsRepository({
    apiKey: import.meta.env.OPENAI_KEY,
    organization: import.meta.env.OPENAI_ORG_ID,
    project: import.meta.env.OPENAI_PROJECT_ID,
  }),
}
