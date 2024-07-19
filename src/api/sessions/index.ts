import { Hono } from "hono"
import { SessionRenewHandler } from "./renew"

const api = new Hono()
api.get("/renew", SessionRenewHandler)

export default api
