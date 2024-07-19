import type { APIRoute } from "astro"
import { RESPONSE } from "~/config/response"
import { Uc } from "~/usecases"

export const GET: APIRoute = async ({ cookies }) => {
  if (!cookies.has("session")) {
    return RESPONSE[401]
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
