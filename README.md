# Domus Web

Frontend da Domus: React + Vite + TypeScript, React Router, Redux Toolkit / RTK Query, MUI, React Hook Form, i18n, Zod, Vitest e Storybook.

Identidade visual: [`docs/design.md`](docs/design.md). Visão de produto: [`docs/product/domus-overview.md`](docs/product/domus-overview.md).

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Abra `http://localhost:5173` (ou `https://web.domus.dev`). O Caddy local faz proxy de `web.domus.dev` para o Vite e encaminha `/bff` e `/users` para a API. `npm run preview` é só para inspecionar `dist/` em localhost — não é o servidor de preprod/prod.

Login é BFF: o browser não recebe tokens. O SPA chama `GET /bff/session` no mesmo origin.

## Scripts

```bash
npm run dev
npm run build
npm run preview
npm test
npm run storybook
```

## Deploy no Railway

O runtime é Caddy a servir `dist/` e a fazer proxy de `/bff` e `/users` para a API. Build e deploy: [`Dockerfile`](Dockerfile) + [`railway.toml`](railway.toml) (healthcheck `/health`).

| Variável | Quando | Valor |
| --- | --- | --- |
| `API_UPSTREAM` | runtime | URL **interna** da API, p.ex. `http://${{domus-back.RAILWAY_PRIVATE_DOMAIN}}:${{domus-back.PORT}}` |

Não definir `HOST`. `API_UPSTREAM` pode ser `*.railway.internal` — o Caddy do front resolve a rede privada; o browser não fala com a API direto.

No Logto, o app é **Traditional Web**. Redirect URI: `https://<domínio-público-do-front>/bff/callback`. Post-logout: origem pública do SPA. Client secret só na API (`Authentication__ClientId` / `Authentication__ClientSecret`).
