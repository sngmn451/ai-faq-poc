import type { IChatUsecase } from "./chat/interface"
import { ChatUsecase } from "./chat/usecase"
import type { ISessionUsecase } from "./session/interface"
import { SessionUsecase } from "./session/usecase"

export interface IUsecase {
  session: ISessionUsecase
  chat: IChatUsecase
}

export const Uc: IUsecase = {
  session: new SessionUsecase(),
  chat: new ChatUsecase(),
}
