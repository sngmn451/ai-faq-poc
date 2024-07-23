import { Chat, TChatMessageSource } from "~/entities/chat"
import type { TQueryOption } from "~/interface/query-options"
import type { IChatUsecase, TChatRenameParams, TChatUcSendMessageParams } from "./interface"
import { Repo } from "~/repositories"
import { DEFAULT_LIMIT, DEFAULT_OFFSET } from "~/config/query-options"
import { and, eq } from "drizzle-orm"
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
            name: chatroom.name || "",
            sessionId: chatroom.sessionId,
            createdAt: chatroom.createdAt,
            updatedAt: chatroom.updatedAt,
            deletedAt: chatroom.deletedAt,
            messages: (
              await Repo.chatmessage.FindAll({
                where: eq(schema.chatmessages.chatroomId, chatroom.id),
                limit: key ? params.limit : 1,
                offset: params.offset,
                orderBy: params.orderBy,
              })
            ).map((message) => ({
              id: message.id,
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
  async GetChatroom(key: string, params: TQueryOption) {
    const chatroom = (
      await Repo.chatroom.FindAll({
        where: eq(schema.chatrooms.key, key),
        limit: 1,
      })
    ).at(0) as (typeof schema.chatrooms)["$inferSelect"]
    const chatmessages = await Repo.chatmessage.FindAll({
      where: eq(schema.chatmessages.chatroomId, chatroom.id),
      limit: params.limit,
      offset: params.offset,
    })
    return {
      data: new Chat({
        id: chatroom.id,
        key: chatroom.key,
        name: chatroom.name || "",
        sessionId: chatroom.sessionId,
        createdAt: chatroom.createdAt,
        updatedAt: chatroom.updatedAt,
        deletedAt: chatroom.deletedAt,
        messages: chatmessages.map((message) => ({
          id: message.id,
          source: TChatMessageSource[message.source as keyof typeof TChatMessageSource],
          message: message.message!,
          createdAt: message.createdAt,
          updatedAt: message.updatedAt,
        })),
      }),
    }
  }
  async LoadChatMessages(key: string, params: TQueryOption) {
    const chatroom = (
      await Repo.chatroom.FindAll({
        where: eq(schema.chatrooms.key, key),
        limit: 1,
      })
    ).at(0) as (typeof schema.chatrooms)["$inferSelect"]

    const count = await Repo.chatmessage.Count({
      ...params,
      where: and(eq(schema.chatmessages.chatroomId, chatroom.id)),
    })

    const chatmessages = await Repo.chatmessage.FindAll({
      ...params,
      where: and(eq(schema.chatmessages.chatroomId, chatroom.id)),
    })
    return {
      data: new Chat({
        id: chatroom.id,
        key: chatroom.key,
        name: chatroom.name || "",
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
  async SendMessage({ key, message, sessionId }: TChatUcSendMessageParams) {
    let roomKey: string | undefined = key
    let roomId: number
    const now = new Date()
    let previousMessage: TChatMessage[] = []

    if (roomKey) {
      const chatroom = (
        await Repo.chatroom.FindAll({
          where: and(eq(schema.chatrooms.key, roomKey), eq(schema.chatrooms.sessionId, sessionId)),
          limit: 1,
        })
      ).at(0) as (typeof schema.chatrooms)["$inferSelect"]

      roomId = chatroom.id

      const history =
        (await Repo.chatmessage.FindAll({
          where: eq(schema.chatmessages.chatroomId, roomId),
          limit: 999,
          orderBy: [{ id: "id", desc: false }],
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
        name: message.substring(0, 20),
        createdAt: now,
        updatedAt: now,
      })) as (typeof schema.chatrooms)["$inferSelect"]

      roomId = newChatroom.id!
      roomKey = newChatroom.key!
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
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    return roomKey
  }

  async Rename({ key, name, sessionId }: TChatRenameParams) {
    const chatroom = (
      await Repo.chatroom.FindAll({
        where: and(eq(schema.chatrooms.key, key!), eq(schema.chatrooms.sessionId, sessionId)),
        limit: 1,
      })
    ).at(0)!
    try {
      await Repo.chatroom.Update(chatroom.id, { name, sessionId, updatedAt: new Date() })
    } catch (e: any) {
      throw new Error(e)
    }
    return true
  }
}
