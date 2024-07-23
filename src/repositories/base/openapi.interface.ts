export interface IBaseOpenAIRepository {
  computeEmbeddings(input: TBaseOpenAIEmbeddingsData[]): Promise<TBaseOpenAIEmbeddingsDataOutput[]>
  cosineSimilarity(vecA: number[], vecB: number[]): number
  findBestRelevant(query: string, data: TBaseOpenAIEmbeddingsDataOutput[]): Promise<TBaseOpenAIEmbeddingsDataOutput>
}
export type TBaseOpenAIEmbeddingsData = {
  question: string
  answer: string
}
export type TBaseOpenAIEmbeddingsDataOutput = {
  question: string
  answer: string
  embedding: number[]
}
