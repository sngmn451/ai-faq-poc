type TChat = {
  id: number
  key: string
  name: string
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
  name: string
  sessionId: string
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
  messages: TChatMessage[]
  constructor(chat: TChat) {
    this.id = chat.id
    this.key = chat.key
    this.name = chat.name
    this.sessionId = chat.sessionId
    this.createdAt = chat.createdAt
    this.updatedAt = chat.updatedAt
    this.deletedAt = chat.deletedAt
    this.messages = chat.messages
  }
}
