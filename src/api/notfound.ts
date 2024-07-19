import type { Context } from "hono"

export async function NotFoundHandler(context: Context) {
  return context.json(
    {
      success: false,
      error: "Not Found",
    },
    {
      status: 404,
    },
  )
}
