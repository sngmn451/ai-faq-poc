import type { Context } from "hono"
import { getCookie } from "hono/cookie"
import { SESSION_KEY } from "~/config/session"
import { Uc } from "~/usecases"

export async function ChatListHandler(context: Context) {
  // @ts-ignore
  const query = context.req.valid("query")
  const session = getCookie(context, SESSION_KEY)
  const response = await Uc.chat.ListChatrooms(session!, query!)

  return context.json({
    ...response,
    data: {
      ...response.data.map((chat) => ({
        ...chat,
        timestamp: chat.createdAt.toISOString(),
      })),
    },
  })
}
