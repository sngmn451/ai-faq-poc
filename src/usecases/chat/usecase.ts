import { Chat, TChatMessageSource } from "~/entities/chat"
import type { TQueryOption } from "~/interface/query-options"
import type { IChatUsecase } from "./interface"
import { Repo } from "~/repositories"
import { DEFAULT_LIMIT, DEFAULT_OFFSET } from "~/config/query-options"
import { and, eq } from "drizzle-orm"
import * as schema from "~/schema"

export class ChatUsecase implements IChatUsecase {
  async ListChatrooms(sessionId: string, params: TQueryOption) {
    const count = await Repo.chatroom.Count({
      ...params,
      where: and(eq(schema.chatrooms.sessionId, sessionId)),
    })
    const response = await Repo.chatroom.FindAll({
      ...params,
      where: and(eq(schema.chatrooms.sessionId, sessionId)),
    })
    const chatrooms = response.map(
      (chatroom) =>
        new Chat({
          id: chatroom.id,
          key: chatroom.key,
          sessionId: chatroom.sessionId,
          createdAt: chatroom.createdAt,
          updatedAt: chatroom.updatedAt,
          deletedAt: chatroom.deletedAt,
          messages: [],
        })
    )
    return {
      data: chatrooms,
      search: params.search || "",
      total: count || 0,
      offset: params.offset || DEFAULT_OFFSET,
      limit: params.limit || DEFAULT_LIMIT,
    }
  }
  async GetChatroom(id: number, params: TQueryOption) {
    const chatroom = (await Repo.chatroom.FindOneById(id)) as (typeof schema.chatrooms)["$inferSelect"]
    const chatmessages = await Repo.chatmessage.FindAll({
      where: eq(schema.chatmessages.chatroomId, id),
      limit: params.limit,
      offset: params.offset,
    })
    return {
      data: new Chat({
        id: chatroom.id,
        key: chatroom.key,
        sessionId: chatroom.sessionId,
        createdAt: chatroom.createdAt,
        updatedAt: chatroom.updatedAt,
        deletedAt: chatroom.deletedAt,
        messages: chatmessages
          .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
          .map((message) => ({
            source: TChatMessageSource[message.source as keyof typeof TChatMessageSource],
            message: message.message!,
            createdAt: message.createdAt,
            updatedAt: message.updatedAt,
          })),
      }),
    }
  }
  async LoadChatMessages(chatroomId: number, params: TQueryOption) {
    const count = await Repo.chatmessage.Count({
      ...params,
      where: and(eq(schema.chatmessages.chatroomId, chatroomId)),
    })
    const chatroom = (await Repo.chatroom.FindOneById(chatroomId)) as (typeof schema.chatrooms)["$inferSelect"]

    const chatmessages = await Repo.chatmessage.FindAll({
      ...params,
      where: and(eq(schema.chatmessages.chatroomId, chatroomId)),
    })
    return {
      data: new Chat({
        id: chatroom.id,
        key: chatroom.key,
        sessionId: chatroom.sessionId,
        createdAt: chatroom.createdAt,
        updatedAt: chatroom.updatedAt,
        deletedAt: chatroom.deletedAt,
        messages: chatmessages
          .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
          .map((message) => ({
            source: TChatMessageSource[message.source as keyof typeof TChatMessageSource],
            message: message.message!,
            createdAt: message.createdAt,
            updatedAt: message.updatedAt,
          })),
      }),
      search: params.search || "",
      total: count || 0,
      offset: params.offset || DEFAULT_OFFSET,
      limit: params.limit || DEFAULT_LIMIT,
    }
  }
}
