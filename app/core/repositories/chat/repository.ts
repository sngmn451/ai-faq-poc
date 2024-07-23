import { Chat } from "@/core/entities/chat/entity"
import type { IChatRepository, TChatSendMessagePayload } from "./interface"
import { BaseApiRepository } from "../base/api.repository"
import { Get, Post } from "@/lib/fetch"
import type { ApiResponse } from "@/core/types/api"
import { nanoid } from "nanoid"
import type { TQueryOptionSchema } from "@/core/types/query-options"

export class ChatRepository extends BaseApiRepository implements IChatRepository {
  async ListChat(): Promise<Chat[]> {
    const chats = (await Get<ApiResponse<TChatResponse[]>>(this.baseUrl + "/chats")).parsedBody?.data as TChatResponse[]
    return chats
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .map(
        (chat) =>
          new Chat({
            id: chat.id,
            key: chat.key,
            name: chat.name,
            timestamp: new Date(chat.updatedAt),
            messages: chat.messages.map((message) => ({
              source: message.source,
              content: message.message,
              timestamp: new Date(message.updatedAt),
              meta: message.meta,
            })),
          }),
      )
  }
  async GetChat(roomKey?: string, options?: Pick<TQueryOptionSchema, "limit" | "offset">) {
    if (roomKey) {
      console.log({ roomKey, options })
      const url = new URL(this.baseUrl + "/chats/" + roomKey, window.location.origin)
      if (options && Object.keys(options).length > 0) {
        Object.entries(options).forEach(([key, value]) => {
          url.searchParams.append(key, String(value))
        })
      }
      const chat = (await Get<ApiResponse<TChatResponse>>(url.toString())).parsedBody?.data as TChatResponse
      return new Chat({
        id: chat.id,
        key: chat.key,
        name: chat.name,
        timestamp: new Date(chat.updatedAt),
        messages: chat.messages
          .sort((a, b) => a.id - b.id)
          .map((message) => ({
            source: message.source,
            content: message.message,
            timestamp: new Date(message.updatedAt),
            meta: message.meta,
          })),
      })
    }
  }
  async SendMessage({ roomKey, message }: TChatSendMessagePayload) {
    const response = (await Post<ApiResponse<TChatSendMessageResponse>>(this.baseUrl + (roomKey ? `/chats/${roomKey}` : "/chats"), { message }))
      .parsedBody?.data as TChatSendMessageResponse
    return response.key
  }
}

type TChatSendMessageResponse = {
  key: string
}
type TChatResponse = {
  id: number
  key: string
  name: string
  createdAt: string
  updatedAt: string
  messages: TChatMessageResponse[]
}
type TChatMessageResponse = {
  id: number
  source: "human" | "ai"
  message: string
  createdAt: string
  updatedAt: string
  meta: {
    avatarUrl?: string
    alt: string
  }
}
