import type { Chat } from "@/core/entities/chat/repository"
import type { IBaseApiRepository } from "../base/api.interface"

export interface IChatRepository extends IBaseApiRepository {
  ListChat(): Promise<Chat[]>
  GetChat(roomId?: string): Promise<Chat | undefined>
  SendMessage({ roomId, message }: TChatSendMessagePayload): Promise<string>
}
export type TChatSendMessagePayload = { roomId?: string; message: string }
