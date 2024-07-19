import { Chat } from "@/core/entities/chat/repository"
import type { IChatRepository } from "./interface"
import { BaseApiRepository } from "../base/api.repository"
import { Get } from "@/lib/fetch"
import type { ApiResponse } from "@/core/types/api"

export class ChatRepository extends BaseApiRepository implements IChatRepository {
  async ListChat(): Promise<Chat[]> {
    const chats = (await Get<ApiResponse<TChatResponse[]>>(new URL(this.baseUrl + "/chats").searchParams.toString())).parsedBody
      ?.data as TChatResponse[]
    return chats
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .map(
        (chat) =>
          new Chat({
            id: chat.id,
            key: chat.key,
            timestamp: new Date(chat.updatedAt),
            messages: chat.messages.map((message) => ({
              source: message.source,
              content: message.content,
              timestamp: new Date(message.updatedAt),
              meta: message.meta,
            })),
          }),
      )
  }
  async GetChat(id: string) {
    const chat = (await Get<ApiResponse<TChatResponse>>(this.baseUrl + "/chats/" + id)).parsedBody?.data as TChatResponse
    return new Chat({
      id: chat.id,
      key: chat.key,
      timestamp: new Date(chat.updatedAt),
      messages: chat.messages.map((message) => ({
        source: message.source,
        content: message.content,
        timestamp: new Date(message.updatedAt),
        meta: message.meta,
      })),
    })
  }
}

type TChatResponse = {
  id: number
  key: string
  createdAt: string
  updatedAt: string
  messages: TChatMessageResponse[]
}
type TChatMessageResponse = {
  source: "human" | "ai"
  content: string
  createdAt: string
  updatedAt: string
  meta: {
    avatarUrl?: string
    alt: string
  }
}
