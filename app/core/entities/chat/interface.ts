export interface IChat {
  GetMessage(): TChatMessage[]
  GetLastMessage(): TChatMessage
}
export type TChatMessage = {
  source: "human" | "ai"
  content: string
  timestamp: Date
  meta: TChatMessageMeta
}
export type TChatMessageMeta = {
  avatarUrl?: string
  alt: string
}
export type TChat = {
  id: number
  key: string
  timestamp: Date
  messages: TChatMessage[]
}
