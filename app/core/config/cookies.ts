import type { AstroCookieSetOptions } from "astro"

export const CookieConfig: AstroCookieSetOptions = {
  secure: true,
  httpOnly: true,
  sameSite: "strict",
  path: "/",
}
