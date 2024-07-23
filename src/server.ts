import { Hono } from "hono"
import { HealthHandler } from "./api/health"
import SessionRoute from "~/api/sessions"
import ChatRoute from "~/api/chats"
import { NotFoundHandler } from "./api/notfound"

const api = new Hono()

api.get("/api/health", HealthHandler)
api.route("/api/v1/sessions", SessionRoute)
api.route("/api/v1/chats", ChatRoute)
api.notFound(NotFoundHandler)

export default api
