import { Chat } from "@/core/entities/chat/repository"
import type { IChatRepository, TChatSendMessagePayload } from "./interface"
import { BaseApiRepository } from "../base/api.repository"
import { Get, Post } from "@/lib/fetch"
import type { ApiResponse } from "@/core/types/api"
import { nanoid } from "nanoid"

export class ChatRepository extends BaseApiRepository implements IChatRepository {
  async ListChat(): Promise<Chat[]> {
    const chats = (await Get<ApiResponse<TChatResponse[]>>(this.baseUrl + "/chats")).parsedBody?.data as TChatResponse[]
    return chats
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .map(
        (chat) =>
          new Chat({
            id: chat.id,
            roomId: chat.key,
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
  async GetChat(roomId?: string) {
    if (roomId) {
      const chat = (await Get<ApiResponse<TChatResponse>>(this.baseUrl + "/chats/" + roomId)).parsedBody?.data as TChatResponse
      console.log({ chat })
      return new Chat({
        id: chat.id,
        roomId: chat.key,
        timestamp: new Date(chat.updatedAt),
        messages: chat.messages.map((message) => ({
          source: message.source,
          content: message.message,
          timestamp: new Date(message.updatedAt),
          meta: message.meta,
        })),
      })
    }
  }
  async SendMessage({ roomId, message }: TChatSendMessagePayload) {
    const response = (await Post<ApiResponse<TChatSendMessageResponse>>(this.baseUrl + (roomId ? `/chats/${roomId}` : "/chats"), { message }))
      .parsedBody?.data as TChatSendMessageResponse
    return response.message
  }
}

type TChatSendMessageResponse = {
  message: string
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
  message: string
  createdAt: string
  updatedAt: string
  meta: {
    avatarUrl?: string
    alt: string
  }
}
