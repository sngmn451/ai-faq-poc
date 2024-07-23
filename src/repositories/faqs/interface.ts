import type { IBaseOpenAIRepository } from "../base/openai.interface"

export interface IOpenAIFaqsRepository extends IBaseOpenAIRepository {
  SendMessage({ message, history }: TOpenAIFaqPrompt): Promise<string>
}

export type TOpenAIFaqPrompt = {
  message: string
  history?: TChatMessage[]
}

export type TChatMessage = {
  source: "human" | "ai"
  message: string
}
