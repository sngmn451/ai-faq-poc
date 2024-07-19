type TChat = {
  id: number
  key: string
  sessionId: string
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
  messages: TChatMessage[]
}
type TChatMessage = {
  source: TChatMessageSource
  message: string
  createdAt: Date
  updatedAt: Date
}
export enum TChatMessageSource {
  human = "human",
  ai = "ai",
}
export class Chat {
  id: number
  key: string
  sessionId: string
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
  message: TChatMessage[]
  constructor(private chat: TChat) {
    this.id = chat.id
    this.key = chat.key
    this.sessionId = chat.sessionId
    this.createdAt = chat.createdAt
    this.updatedAt = chat.updatedAt
    this.deletedAt = chat.deletedAt
    this.message = chat.messages
  }
}
