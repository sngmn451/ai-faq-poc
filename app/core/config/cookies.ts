import type { AstroCookieSetOptions } from "astro"

export const CookieConfig: AstroCookieSetOptions = {
  secure: true,
  httpOnly: true,
  sameSite: "strict",
  maxAge: 60 * 60 * 24,
  path: "/",
}
