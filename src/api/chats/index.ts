import { Hono } from "hono"
import { ChatListHandler } from "./list"
import { SessionMiddleware } from "~/middlewares/session"
import { zValidator } from "@hono/zod-validator"
import { ZQueryOptionSchema } from "~/interface/query-options"

const api = new Hono()
api.get("/", SessionMiddleware, zValidator("query", ZQueryOptionSchema), ChatListHandler)
