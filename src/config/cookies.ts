import type { CookieOptions } from "hono/utils/cookie"

export const CookieConfig: CookieOptions = {
  secure: true,
  httpOnly: true,
  sameSite: "strict",
  path: "/",
}
