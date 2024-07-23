import type { Context } from "hono"
import { getCookie } from "hono/cookie"
import { z } from "zod"
import { SESSION_KEY } from "~/config/session"
import { Uc } from "~/usecases"

export async function ChatSendMessageHandler(context: Context) {
  // @ts-ignore
  const { message } = context.req.valid("json") as string

  const session = getCookie(context, SESSION_KEY)
  const params: {
    key?: string
    sessionId: string
    message: string
  } = {
    sessionId: session!,
    message,
  }
  if (context.req.param("key")) {
    params.key = context.req.param("key")!
  }
  const response = await Uc.chat.SendMessage(params)

  return context.json({
    data: {
      key: response,
    },
  })
}

export const ZChatSendMessageSchema = z.object({ message: z.string() })
