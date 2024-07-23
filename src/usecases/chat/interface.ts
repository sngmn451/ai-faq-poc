import type { Chat } from "~/entities/chat"
import type { TQueryOption } from "~/interface/query-options"
import type { TRestApiListChildResponseSchema, TRestApiListResponseSchema, TRestApiResponse } from "~/interface/response"

export interface IChatUsecase {
  ListChatrooms(sessionId: string, params: TQueryOption, key?: string): Promise<TRestApiListResponseSchema<Chat>>
  GetChatroom(key: string, params: TQueryOption): Promise<TRestApiResponse<Chat>>
  LoadChatMessages(key: string, params: TQueryOption): Promise<TRestApiListChildResponseSchema<Chat>>
  SendMessage({ key, sessionId, message }: TChatUcSendMessage): Promise<string>
}

export type TChatUcSendMessage = {
  key?: string
  sessionId: string
  message: string
}
