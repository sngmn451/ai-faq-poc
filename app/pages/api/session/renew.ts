import { CookieConfig } from "@/core/config/cookies"
import type { APIRoute } from "astro"
import { differenceInSeconds } from "date-fns"
import { Uc } from "~/usecases"

const EXPIRES_BEFORE = 60 * 5 // 5 mins before session expires
export const GET: APIRoute = async ({ cookies }) => {
  if (!cookies.has("session")) {
    const session = await Uc.session.Create()
    cookies.set("session", session.id, {
      ...CookieConfig,
      maxAge: differenceInSeconds(session.expires, new Date()) - EXPIRES_BEFORE,
    })
  }
  return new Response(
    JSON.stringify({
      success: true,
    }),
    {
      status: 200,
    }
  )
}
