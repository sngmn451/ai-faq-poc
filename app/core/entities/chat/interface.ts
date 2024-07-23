export interface IChat {
  GetId(): number
  GetKey(): string
  GetName(): string
  GetMessages(): TChatMessage[]
  GetLastMessage(): TChatMessage
  Rename(name: string): void
}
export type TChatMessage = {
  source: "human" | "ai"
  content: string
  timestamp: Date
}
export type TChat = {
  id: number
  name: string
  key: string
  timestamp: Date
  messages: TChatMessage[]
}
