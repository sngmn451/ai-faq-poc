import type { Context } from "hono"

export async function HealthHandler(context: Context) {
  return context.json({
    success: true,
    data: {
      now: new Date().toISOString(),
    },
  })
}
