import { franc } from "franc"
import { Repo } from ".."
import { BaseOpenAIRepository } from "../base/openapi.repository"
import type { IOpenAIFaqsRepository, TOpenAIFaqPrompt } from "./interface"
import { translateText } from "@/lib/translate"
import { preprocessQuery } from "@/lib/ai"

const OPENAPI_MODEL = "gpt-4o-mini"

export class OpenAIFaqsRepository extends BaseOpenAIRepository implements IOpenAIFaqsRepository {
  async SendMessage({ message, history }: TOpenAIFaqPrompt) {
    const detectedLang = franc(message)
    const faqLang = "eng"

    let translatedQuery = message
    if (faqLang !== detectedLang) {
      translatedQuery = await translateText(message, "en")
    }
    const faqs = (await Repo.faq.FindAll({})).map((faq) => ({
      question: faq.question,
      answer: faq.answer,
      embedding: faq.embedding as number[],
    }))
    const faqsContext = faqs.map((faq) => `Q: ${faq.question}\nA: ${faq.answer}`).join("\n\n")

    const preprocessedQuery = preprocessQuery(message)
    const relevantFAQ = await this.findBestRelevant(preprocessedQuery, faqs)

    console.log({ faqs, faqsContext, translatedQuery, relevantFAQ, preprocessQuery })

    if (history) {
      history.map((entry) => `${entry.source === "human" ? "User: " : "AI: "} ${entry.message}\n"}`).join("\n")
    }
    let responseMessage: string
    if (relevantFAQ) {
      responseMessage = relevantFAQ.answer
      if (detectedLang !== faqLang) {
        responseMessage = await translateText(responseMessage, detectedLang)
      }
    } else {
      const openaiResponse = await this.ai.chat.completions.create({
        model: OPENAPI_MODEL,
        messages: [
          {
            role: "system",
            content: faqsContext,
          },
          ...(history
            ?.filter((entry) => entry.source === "human")
            ?.map((entry) => ({
              role: "user" as "user",
              content: entry.message,
            })) || []),
          {
            role: "user",
            content: translatedQuery,
          },
        ],
      })
      responseMessage = openaiResponse.choices.at(0)!.message.content || ""
      if (detectedLang !== faqLang) {
        responseMessage = await translateText(responseMessage, detectedLang)
      }
    }
    return responseMessage
  }
}
