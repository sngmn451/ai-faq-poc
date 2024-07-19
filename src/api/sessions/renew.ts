import type { Context } from "hono"
import { getCookie, setCookie } from "hono/cookie"
import { differenceInSeconds } from "date-fns"
import { CookieConfig } from "~/config/cookies"
import { Uc } from "~/usecases"
import { SESSION_KEY } from "~/config/session"

const EXPIRES_BEFORE = 60 * 5 // 5 mins before session expires
export async function SessionRenewHandler(context: Context) {
  const session = getCookie(context, SESSION_KEY)
  if (!session) {
    const session = await Uc.session.Create()
    setCookie(context, SESSION_KEY, session.id, {
      ...CookieConfig,
      maxAge: differenceInSeconds(session.expires, new Date()) - EXPIRES_BEFORE,
    })
  }
  return context.json({
    success: true,
  })
}
