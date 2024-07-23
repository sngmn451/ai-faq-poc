import { Translator } from "google-translate-api-x"
import { HttpProxyAgent } from "http-proxy-agent"
import { proxy } from "~/lib/proxy"

export async function translateText(
  text: string,
  to: string,
): Promise<{
  from: string
  text: string
}> {
  const translator = new Translator({ to, forceBatch: false })
  const agent = new HttpProxyAgent(proxy())
  const translated = await translator.translate(text, { to, requestOptions: { agent } })
  return {
    from: translated.from.language.iso,
    text: translated.text,
  }
}
