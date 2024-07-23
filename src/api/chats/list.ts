import type { Context } from "hono"
import { getCookie } from "hono/cookie"
import { SESSION_KEY } from "~/config/session"
import { Uc } from "~/usecases"
import type { TQueryOptionSchema } from "~/interface/query-options"

export async function ChatListHandler(context: Context) {
  // @ts-ignore
  const query = context.req.valid("query") as TQueryOptionSchema
  const key = context.req.param("key") ? context.req.param("key") : undefined

  const session = getCookie(context, SESSION_KEY)
  const response = await Uc.chat.ListChatrooms(session!, query, key!)

  return context.json(
    key
      ? {
          ...response,
          data: response.data.at(0),
        }
      : response,
  )
}
