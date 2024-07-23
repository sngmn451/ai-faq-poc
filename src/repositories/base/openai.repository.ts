import { OpenAI } from "openai"
import type { IBaseOpenAIRepository, TBaseOpenAIEmbeddingsData, TBaseOpenAIEmbeddingsDataOutput } from "./openai.interface"

const OPENAI_MODEL = "text-embedding-ada-002"
export class BaseOpenAIRepository implements IBaseOpenAIRepository {
  ai: OpenAI
  constructor({ apiKey, organization, project }: { apiKey: string; organization: string; project: string }) {
    this.ai = new OpenAI({
      apiKey,
      organization,
      project,
    })
  }
  async computeEmbeddings(input: TBaseOpenAIEmbeddingsData[]) {
    const response = await this.ai.embeddings.create({
      input: input.map((i) => i.question),
      model: OPENAI_MODEL,
    })
    return response.data.map((value, index) => ({
      question: input[index].question,
      answer: input[index].answer,
      embedding: value.embedding,
    }))
  }
  cosineSimilarity(vecA: number[], vecB: number[]) {
    const dotProduct = vecA.reduce((sum, a, idx) => sum + a * vecB[idx], 0)
    const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0))
    const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0))
    return dotProduct / (magnitudeA * magnitudeB)
  }
  async findBestRelevant(query: string, data: TBaseOpenAIEmbeddingsDataOutput[]) {
    const response = await this.ai.embeddings.create({
      input: [query],
      model: OPENAI_MODEL,
    })
    const queryEmbedding = response.data.at(0)!.embedding
    let bestMatch: TBaseOpenAIEmbeddingsDataOutput = data[0]
    let bestScore = -1
    for (const value of data) {
      const score = this.cosineSimilarity(queryEmbedding, value.embedding)
      if (score > bestScore) {
        bestScore = score
        bestMatch = value
      }
    }
    return bestMatch
  }
}
