import { Hono } from "hono"
import { zValidator } from "@hono/zod-validator"
import { SessionMiddleware } from "~/middlewares/session"
import { ZQueryOptionSchema } from "~/interface/query-options"
import { ChatSendMessageHandler, ZChatSendMessageSchema } from "./send-message"
import { ChatListHandler } from "./list"
import { ChatRenameHandler, ZChatRenameSchema } from "./rename"

const api = new Hono()
api.all("/*", SessionMiddleware)
api.get("/", zValidator("query", ZQueryOptionSchema), ChatListHandler)
api.get("/:key", zValidator("query", ZQueryOptionSchema), ChatListHandler)
api.post("/:key", zValidator("json", ZChatSendMessageSchema), ChatSendMessageHandler)
api.post("/", zValidator("json", ZChatSendMessageSchema), ChatSendMessageHandler)
api.put("/:key/rename", zValidator("json", ZChatRenameSchema), ChatRenameHandler)
// api.delete("/", zValidator("json", ZChatSendMessageSchema), ChatSendMessageHandler)

export default api
