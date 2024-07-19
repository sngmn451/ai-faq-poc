import type { Chat } from "~/entities/chat"
import type { TQueryOption } from "~/interface/query-options"
import type { TRestApiListChildResponseSchema, TRestApiListResponseSchema, TRestApiResponse } from "~/interface/response"

export interface IChatUsecase {
  ListChatrooms(sessionId: string, params: TQueryOption): Promise<TRestApiListResponseSchema<Chat>>
  GetChatroom(id: number, params: TQueryOption): Promise<TRestApiResponse<Chat>>
  LoadChatMessages(chatroomId: number, params: TQueryOption): Promise<TRestApiListChildResponseSchema<Chat>>
}
