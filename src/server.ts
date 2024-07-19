import { Hono } from "hono"

const api = new Hono()
api.get("/api/health", (c) => {
  return c.json({
    success: true,
    data: {
      now: new Date().toISOString(),
    },
  })
})
api.notFound(function (context) {
  return context.json(
    {
      success: false,
      error: "Not Found",
    },
    {
      status: 404,
    },
  )
})
export default api
