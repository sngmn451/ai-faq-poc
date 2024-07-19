import { z } from "zod"
import { SQL } from "drizzle-orm"
import { DEFAULT_LIMIT, DEFAULT_OFFSET } from "~/config/query-options"

const ZQueryOrderBySchema = z.object({ id: z.string(), desc: z.boolean() })
export const ZQueryOptionSchema = z.object({
  search: z.string().optional(),
  offset: z.preprocess((v) => Number(v) || DEFAULT_OFFSET, z.number().optional()),
  limit: z.preprocess((v) => Number(v) || DEFAULT_LIMIT, z.number().optional()),
  orderBy: z.preprocess((v) => {
    if (!v || v === "") {
      return []
    }
    return JSON.parse(decodeURIComponent(v as string))
  }, z.array(ZQueryOrderBySchema).optional()),
})

export type TQueryOptionSchema = z.infer<typeof ZQueryOptionSchema>

export type TQueryOption = {
  search?: string
  where?: SQL
  limit?: number
  offset?: number
  orderBy?: z.infer<typeof ZQueryOrderBySchema>[]
}
