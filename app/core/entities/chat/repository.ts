import type { IChat, TChat, TChatMessage } from "./interface"

export class Chat implements IChat {
  constructor(private chat: TChat) {}
  GetId() {
    return this.chat.id
  }
  GetRoomId() {
    return this.chat.roomId
  }
  GetMessages() {
    return this.chat.messages
  }
  GetLastMessage() {
    return this.chat.messages.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime()).at(0) as TChatMessage
  }
}
