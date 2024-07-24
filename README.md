# AIFAQ Project

Use PNPM for better DX

## Pre-requisite

[Install turso CLI](https://docs.turso.tech/cli/installation)

## Dev mode

- `pnpm dev` for run dev mode
- `pnpm db:dev` for run turso DB
- `pnpm db:generate` to generate migration file when update schema
- `pnpm db:migrate` to run migration script
- `pnpm db:open` to open drizzle-studio (database GUI)

## Folder structure

```
ai-faq/
├─ app/
│  ├─ components/
│  ├─ containers/
│  ├─ core/
│  │  ├─ config/
│  │  ├─ entities/
│  │  ├─ repositories/
│  │  ├─ stores/
│  │  └─ types/
│  ├─ hook/
│  ├─ layout/
│  ├─ lib/
│  ├─ pages/
│  │  ├─ api/
│  │  │  └─ [...path].ts
│  │  ├─ chat/
│  │  │  └─ [...path].astro
│  │  └─ index.astro
│  └─ routes/
├─ migrations/
├─ public/
├─ src/
│  ├─ api/
│  ├─ config/
│  ├─ db/
│  ├─ entities/
│  ├─ interface/
│  ├─ lib/
│  ├─ middlewares/
│  ├─ repositories/
│  ├─ schema/
│  ├─ seed/
│  ├─ usecases/
│  └─ server.ts
├─ astro.config.ts
├─ drizzle.config.ts
├─ package.json
└─ tsconfig.json
```

## Diagram

### Create session

```mermaid
sequenceDiagram
  autonumber
  actor User
  participant API
  participant DB
  loop Check session every 5 minutes
    User->>User: Is session valid?
    User->>+API: Renew session if TTL under X
    Note right of API: Create session and set in cookies
    API->>DB: Save session in DB
    API-->>-User: Set session in Cookies
  end
```

Chat

```mermaid
sequenceDiagram
  autonumber
  actor User
  participant API
  participant DB
  participant Translate
  participant AI

  User->>+API: Send message
  API->>DB: Save user message
  API->>+DB: Query FAQ
  DB-->>-API: Build FAQ
  API->>+Translate: Translate message into FAQ Language
  Translate-->>-API: Return message in FAQ Language
  API->>+AI: Send Context with FAQ and find best related answer
  AI-->>-API: Return best matched answer
  API->>+Translate: Translate back to user language
  Translate-->>-API: Return translated message
  API->>DB: Save translated message
  API-->>-User: Return translated message
```
