import type { APIRoute } from "astro"
import { RESPONSE } from "~/config/response"
import { ZQueryOptionSchema } from "~/interface/query-options"
import { Uc } from "~/usecases"

export const GET: APIRoute = async ({ cookies, request }) => {
  if (!cookies.has("session")) {
    return RESPONSE[401]
  }
  const query = Object.fromEntries(new URLSearchParams(new URL(request.url).search))
  try {
    ZQueryOptionSchema.parse(query)
  } catch {
    return RESPONSE[422]
  }
  const response = await Uc.chat.ListChatrooms(cookies.get("session")!.value, query)
  return new Response(
    JSON.stringify({
      ...response,
      data: {
        ...response.data.map((chat) => ({
          ...chat,
          timestamp: chat.createdAt.toISOString(),
        })),
      },
    }),
    {
      status: 200,
    }
  )
}
