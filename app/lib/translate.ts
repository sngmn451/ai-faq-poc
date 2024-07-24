import { Translator } from "google-translate-api-x"
import { HttpProxyAgent } from "http-proxy-agent"
import { proxy } from "~/lib/proxy"
import { v2 } from "@google-cloud/translate"

/**
 * Free translation using proxy
 * Not work in cloudflare with `Error: The 'credentials' field on 'RequestInitializerDict' is not implemented.`
 */
async function translateFree(
  text: string,
  to: string,
): Promise<{
  from: string
  text: string
}> {
  const translator = new Translator({ to, forceBatch: false })
  const isCredentialsSupported = "credentials" in Request.prototype
  const agent = new HttpProxyAgent(proxy(), {
    headers: {
      credentials: isCredentialsSupported ? "include" : undefined,
    },
  })
  const translated = await translator.translate(text, { to, requestOptions: { agent } })
  return {
    from: translated.from.language.iso,
    text: translated.text,
  }
}

async function translateGoogle(
  text: string,
  to: string,
): Promise<{
  from: string
  text: string
}> {
  const credential = JSON.parse(atob(import.meta.env.GCT_CREDENTIAL)) as TGCTCredential
  const { Translate } = v2
  const translationClient = new Translate({
    projectId: credential.project_id,
    credentials: {
      client_email: credential.client_email,
      private_key: credential.private_key,
    },
  })
  const [detection] = await translationClient.detect(text)

  const [translation] = await translationClient.translate(text, to)
  return {
    from: detection.language,
    text: translation,
  }
}

type TGCTCredential = {
  project_id: string
  private_key: string
  client_email: string
}

export const translateText = translateGoogle
