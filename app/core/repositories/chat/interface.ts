import type { Chat } from "@/core/entities/chat/entity"
import type { IBaseApiRepository } from "../base/api.interface"

export interface IChatRepository extends IBaseApiRepository {
  ListChat(): Promise<Chat[]>
  GetChat(roomKey?: string): Promise<Chat | undefined>
  SendMessage({ roomKey, message }: TChatSendMessagePayload): Promise<string>
}
export type TChatSendMessagePayload = { roomKey?: string; message: string }
