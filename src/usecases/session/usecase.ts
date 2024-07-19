import type { ISessionUsecase } from "./interface"
import { Repo } from "~/repositories"

export class SessionUsecase implements ISessionUsecase {
  async Create() {
    const session = await await Repo.session.Create({})
    return {
      id: session.id,
      expires: new Date(session.expires),
    }
  }
}
