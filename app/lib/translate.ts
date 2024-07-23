import { translate } from "@vitalets/google-translate-api"

export async function translateText(text: string, to: string): Promise<string> {
  return (await translate(text, { to: "en" })).text
}
