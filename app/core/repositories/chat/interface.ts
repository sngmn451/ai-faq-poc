import type { Chat } from "@/core/entities/chat/entity"
import type { IBaseApiRepository } from "../base/api.interface"
import type { TQueryOptionSchema } from "@/core/types/query-options"

export interface IChatRepository extends IBaseApiRepository {
  ListChat(): Promise<Chat[]>
  GetChat(roomKey?: string, options?: TQueryOptionSchema): Promise<Chat | undefined>
  SendMessage({ roomKey, message }: TChatSendMessagePayload): Promise<string>
  Rename({ roomKey, name }: TChatRenamePayload): Promise<boolean>
}
export type TChatSendMessagePayload = { roomKey?: string; message: string }

export type TChatRenamePayload = {
  roomKey: string
  name: string
}
