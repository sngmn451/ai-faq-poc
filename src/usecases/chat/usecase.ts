import { Chat, TChatMessageSource } from "~/entities/chat"
import type { TQueryOption } from "~/interface/query-options"
import type { IChatUsecase, TChatUcSendMessage } from "./interface"
import { Repo } from "~/repositories"
import { DEFAULT_LIMIT, DEFAULT_OFFSET } from "~/config/query-options"
import { and, eq, inArray, sql } from "drizzle-orm"
import * as schema from "~/schema"
import type { TChatMessage } from "~/repositories/faqs/interface"

export class ChatUsecase implements IChatUsecase {
  async ListChatrooms(sessionId: string, params: TQueryOption, key?: string) {
    const count = await Repo.chatroom.Count({
      ...params,
      where: key
        ? and(eq(schema.chatrooms.sessionId, sessionId), eq(schema.chatrooms.key, key))
        : and(eq(schema.chatrooms.sessionId, sessionId)),
    })
    const response = await Repo.chatroom.FindAll({
      ...params,
      where: key
        ? and(eq(schema.chatrooms.sessionId, sessionId), eq(schema.chatrooms.key, key))
        : and(eq(schema.chatrooms.sessionId, sessionId)),
    })

    const chatrooms = await Promise.all(
      response.map(
        async (chatroom) =>
          new Chat({
            id: chatroom.id,
            key: chatroom.key,
            sessionId: chatroom.sessionId,
            createdAt: chatroom.createdAt,
            updatedAt: chatroom.updatedAt,
            deletedAt: chatroom.deletedAt,
            messages: (
              await Repo.chatmessage.FindAll({
                where: eq(schema.chatmessages.chatroomId, chatroom.id),
                limit: key ? 1 : params.limit,
                offset: params.offset,
              })
            ).map((message) => ({
              source: TChatMessageSource[message.source as keyof typeof TChatMessageSource],
              message: message.message!,
              createdAt: message.createdAt,
              updatedAt: message.updatedAt,
            })),
          }),
      ),
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
  async SendMessage({ chatroomId, message, sessionId }: TChatUcSendMessage) {
    let roomId: number | undefined = chatroomId
    const now = new Date()
    let previousMessage: TChatMessage[] = []
    if (roomId) {
      const history =
        (await Repo.chatmessage.FindAll({
          where: and(eq(schema.chatmessages.chatroomId, roomId), eq(schema.chatrooms.sessionId, sessionId)),
          orderBy: [{ id: "createdAt", desc: false }],
        })) || []
      previousMessage = history.map((message) => ({
        source: TChatMessageSource[message.source as keyof typeof TChatMessageSource],
        message: message.message!,
      }))

      await Repo.chatmessage.Create({
        chatroomId: roomId,
        message,
        source: TChatMessageSource.human,
        sessionId,
        createdAt: now,
        updatedAt: now,
      })
    } else {
      const newChatroom = (await Repo.chatroom.Create({
        sessionId,
        createdAt: now,
        updatedAt: now,
      })) as (typeof schema.chatrooms)["$inferSelect"]

      roomId = newChatroom.id!
      await Repo.chatmessage.Create({
        chatroomId: roomId,
        message,
        source: TChatMessageSource.human,
        sessionId,
        createdAt: now,
        updatedAt: now,
      })
    }
    const response = await Repo.aifaq.SendMessage({ message, history: previousMessage })
    await Repo.chatmessage.Create({
      chatroomId: roomId,
      message: response,
      source: TChatMessageSource.ai,
      sessionId,
      createdAt: now,
      updatedAt: now,
    })
    return response
  }
}
