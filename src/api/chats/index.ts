import { Hono } from "hono"
import { zValidator } from "@hono/zod-validator"
import { SessionMiddleware } from "~/middlewares/session"
import { ZQueryOptionSchema } from "~/interface/query-options"
import { ChatSendMessageHandler, ZChatSendMessageSchema } from "./send-message"
import { ChatListHandler } from "./list"

const api = new Hono()
api.all("/*", SessionMiddleware)
api.get("/", zValidator("query", ZQueryOptionSchema), ChatListHandler)
api.get("/:key", zValidator("query", ZQueryOptionSchema), ChatListHandler)
api.post("/:key", zValidator("json", ZChatSendMessageSchema), ChatSendMessageHandler)
api.post("/", zValidator("json", ZChatSendMessageSchema), ChatSendMessageHandler)

export default api
