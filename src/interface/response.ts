import z from "zod"

export type TRestApiResponse<T> = {
  data?: T
}

export function ZRestApiListResponseSchema<ItemType extends z.ZodTypeAny>(itemSchema: ItemType) {
  return z.object({
    search: z.string().optional(),
    total: z.number(),
    offset: z.number(),
    limit: z.number(),
    data: z.array(itemSchema),
  })
}

export type TListApiResponseSchema<T> = {
  total: number
  data: T[]
}

export type TRestApiListResponseSchema<T> = {
  search: string
  total: number
  offset: number
  limit: number
  data: T[]
}
export type TRestApiListChildResponseSchema<T> = {
  search: string
  total: number
  offset: number
  limit: number
  data: T
}
