import { v2 } from "@google-cloud/translate"

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
