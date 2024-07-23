import "dotenv/config"
import data from "./data.json"
import * as schema from "~/schema"
import { db } from "~/db/connection.cli"
import { BaseOpenAIRepository } from "~/repositories/base/openai.repository"

export async function Migrate() {
  const Repo = new BaseOpenAIRepository({
    apiKey: process.env.OPENAI_KEY!,
    organization: process.env.OPENAI_ORG_ID!,
    project: process.env.OPENAI_PROJECT_ID!,
  })
  const faqs = await Repo.computeEmbeddings(data)
  await db.transaction(async (tx) => {
    faqs.map(async (faq) => {
      await tx.insert(schema.faqs).values(faq)
    })
  })
  console.log(`Successfully seeded ${faqs.length} FAQs`)
}

Migrate()
  .then(() => console.log("🎉 Success"))
  .catch((error) => console.error(error))
