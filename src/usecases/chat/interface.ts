import type { Chat } from "~/entities/chat"
import type { TQueryOption } from "~/interface/query-options"
import type { TRestApiListChildResponseSchema, TRestApiListResponseSchema, TRestApiResponse } from "~/interface/response"

export interface IChatUsecase {
  ListChatrooms(sessionId: string, params: TQueryOption, key?: string): Promise<TRestApiListResponseSchema<Chat>>
  GetChatroom(key: string, params: TQueryOption): Promise<TRestApiResponse<Chat>>
  LoadChatMessages(key: string, params: TQueryOption): Promise<TRestApiListChildResponseSchema<Chat>>
  SendMessage(params: TChatUcSendMessageParams): Promise<string>
  Rename(params: TChatRenameParams): Promise<boolean>
}

type TChatSingleParams = {
  key?: string
  sessionId: string
}
export type TChatUcSendMessageParams = TChatSingleParams & {
  message: string
}
export type TChatRenameParams = TChatSingleParams & {
  name: string
}
