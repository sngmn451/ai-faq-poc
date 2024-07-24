/// <reference types="astro/client" />
/// <reference types="@cloudflare/workers-types" />

type Runtime = import("@astrojs/cloudflare").Runtime<Env>

declare namespace App {
  interface Locals extends Runtime {}
}

interface ImportMetaEnv {
  readonly DB_URL: string
  readonly DB_AUTHTOKEN: string
  readonly OPENAI_KEY: string
  readonly OPENAI_PROJECT_ID: string
  readonly OPENAI_ORG_ID: string
  readonly GCT_CREDENTIAL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
