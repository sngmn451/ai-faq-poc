import type { Context, Next } from "hono"
import { getCookie } from "hono/cookie"
import { SESSION_KEY } from "~/config/session"

export async function SessionMiddleware(context: Context, next: Next) {
  const session = getCookie(context, SESSION_KEY)
  if (!session) {
    throw context.json(
      {
        success: false,
      },
      { status: 401 },
    )
  }
  await next()
}
