import type { Chat } from "@/core/entities/chat/repository"
import type { IBaseApiRepository } from "../base/api.interface"

export interface IChatRepository extends IBaseApiRepository {
  ListChat(): Promise<Chat[]>
  GetChat(id: string): Promise<Chat>
}
