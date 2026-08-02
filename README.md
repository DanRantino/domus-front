# Domus Front

Frontend for Domus (TanStack Start + Logto OIDC).

## Setup

```bash
npm install
cp .env.example .env.local
```

Fill values in `.env.local`:

| Variable | Required | Notes |
|----------|----------|--------|
| `VITE_LOGTO_ENDPOINT` | yes | Prefixed to Logto preprod: `https://logto-auth-preprod.up.railway.app/` |
| `VITE_LOGTO_APP_ID` | yes | SPA application id from Logto Admin Console |
| `VITE_LOGTO_API_RESOURCE` | when calling API | API resource / audience configured in Logto |
| `VITE_DOMUS_API_BASE_URL` | when API exists | e.g. `http://localhost:3001` — leave empty for IdP-only progress |

In Logto Admin Console, add redirect URI `http://localhost:3000/callback` and post sign-out redirect `http://localhost:3000/`.

```bash
npm run dev
```

Open `http://localhost:3000`.

## Auth model

- Logto owns authentication and tokens.
- Domus User (`id` + `identity_id`) is resolved via API `GET /me`.
- Login alone never creates a Domus User or implies Domus access.

See [docs/api-users-contract.md](docs/api-users-contract.md) for the API contract.

## Scripts

```bash
npm run dev
npm run build
npm run start   # production server (Nitro → .output/server/index.mjs)
npm run preview
```

## Deploy (Railway)

Production build uses Nitro and emits `.output/`. Start with:

```bash
npm run start
# or: HOST=0.0.0.0 node .output/server/index.mjs
```

Ensure Logto redirect URIs include the Railway domain callback, e.g. `https://domus-front-preprod.up.railway.app/callback`.
