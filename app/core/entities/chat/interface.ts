export interface IChat {
  GetId(): number
  GetRoomId(): string
  GetMessages(): TChatMessage[]
  GetLastMessage(): TChatMessage
}
export type TChatMessage = {
  source: "human" | "ai"
  content: string
  timestamp: Date
}
export type TChat = {
  id: number
  roomId: string
  timestamp: Date
  messages: TChatMessage[]
}
