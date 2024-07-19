import type { IChatRepository } from "./chat/interface"
import { ChatRepository } from "./chat/repository"

export interface Repository {
  chat: IChatRepository
}

export const Repo: Repository = {
  chat: new ChatRepository(),
}
