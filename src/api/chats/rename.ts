import type { Context } from "hono"
import { getCookie } from "hono/cookie"
import { z } from "zod"
import { SESSION_KEY } from "~/config/session"
import { Uc } from "~/usecases"

export async function ChatRenameHandler(context: Context) {
  // @ts-ignore
  const { name } = context.req.valid("json") as string

  const session = getCookie(context, SESSION_KEY)
  const params: {
    key?: string
    sessionId: string
    name: string
  } = {
    sessionId: session!,
    name,
  }
  if (context.req.param("key")) {
    params.key = context.req.param("key")!
  }
  const response = await Uc.chat.Rename(params)

  return context.json({
    data: {
      message: `Chat name updated 🎉`,
    },
  })
}

export const ZChatRenameSchema = z.object({ name: z.string() })
