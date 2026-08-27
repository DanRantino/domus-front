# Domus Web

Frontend da Domus: React + Vite + TypeScript, React Router, Redux Toolkit / RTK Query, MUI, React Hook Form, i18n, Zod, Vitest e Storybook.

Identidade visual: [`docs/design.md`](docs/design.md). Visão de produto: [`docs/product/domus-overview.md`](docs/product/domus-overview.md).

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Abra `https://web.domus.dev` (Caddy local). O Caddy encaminha `/Callback`, `/SignedOutCallback`, `/auth/*` e `/api/*` para a API e o resto para o Vite. `http://localhost:5173` também faz proxy desses caminhos, mas o login OIDC usa a origem `https://web.domus.dev`. `npm run preview` é só para inspecionar `dist/` em localhost — não é o servidor de preprod/prod.

As `VITE_*` entram no bundle no build. Localmente use `.env.local` (não é copiado para a imagem). No Railway, `VITE_DOMUS_API_BASE_URL` é variável de **build**; `DOMUS_API_UPSTREAM` é variável de **runtime** do Caddy.

O frontend **não** obtém tokens do Logto. Login é navegação top-level para `/auth/login`; as chamadas de produto usam `fetch('/api/...', { credentials: 'include' })`.

## Scripts

```bash
npm run dev
npm run build
npm run preview
npm test
npm run storybook
```

## Deploy no Railway

O runtime é Caddy a servir `dist/`. Build e deploy: [`Dockerfile`](Dockerfile) + [`railway.toml`](railway.toml) (healthcheck `/health`). Não há `vite preview` nem `npm start` em preprod/prod.

| Variável | Quando | Valor |
| --- | --- | --- |
| `VITE_DOMUS_API_BASE_URL` | build | `/api` (same-origin; o Caddy remove o prefixo `/api` antes da API) |
| `DOMUS_API_UPSTREAM` | runtime | URL **privada** da API, p.ex. `http://${{Domus.Api.RAILWAY_PRIVATE_DOMAIN}}:${{Domus.Api.PORT}}` |

Não definir `HOST`. Não apontar `VITE_DOMUS_API_BASE_URL` para `*.railway.internal` — o browser não resolve a rede privada. O Caddy do front é que alcança a API na rede interna.

Segredos Logto (`Logto__AppId`, `Logto__AppSecret`) ficam no serviço da **API**, não no bundle do front. Não há `VITE_LOGTO_*`.

Na API do mesmo ambiente, a origem CORS continua a URL **pública** deste serviço (Swagger / clientes Bearer em `api.domus.dev`):

```text
Cors__Origins__0=https://${{domus-front.RAILWAY_PUBLIC_DOMAIN}}
```

### Console Logto (Traditional Web App)

Crie um aplicativo **Traditional Web** (não SPA) por ambiente. Redirect URIs na **origem do front**, no formato do [tutorial MVC](https://docs.logto.io/pt-BR/quick-starts/dotnet-core/mvc):

| Ambiente | Redirect URI | Post sign-out redirect URI |
| --- | --- | --- |
| Local | `https://web.domus.dev/Callback` | `https://web.domus.dev/SignedOutCallback` |
| Railway | `https://<domínio-público-do-front>/Callback` | `https://<domínio-público-do-front>/SignedOutCallback` |

Não use `/api/Callback`. O Caddy entrega `/Callback` e `/SignedOutCallback` à API.
