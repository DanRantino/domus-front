# Domus Web

Frontend da Domus: React + Vite + TypeScript, React Router, Redux Toolkit / RTK Query, MUI, React Hook Form, i18n, Zod, Vitest e Storybook.

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Abra `http://localhost:5173` (ou `https://web.domus.dev`). O Caddy local faz proxy de `web.domus.dev` para o Vite; por isso o `server.allowedHosts` inclui só esse hostname. `npm run preview` é só para inspecionar `dist/` em localhost — não é o servidor de preprod/prod.

As `VITE_*` entram no bundle no build. Localmente use `.env.local` (não é copiado para a imagem). No Railway as mesmas chaves são variáveis de **build** do serviço `domus-front`.

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
| `VITE_LOGTO_ENDPOINT` | build | tenant Logto desse ambiente |
| `VITE_LOGTO_APP_ID` | build | SPA application id |
| `VITE_LOGTO_API_RESOURCE` | build | igual ao `Authentication__Audience` da API |
| `VITE_LOGTO_PASSWORD_URL` | build | Account API do Logto |
| `VITE_DOMUS_API_BASE_URL` | build | URL **pública** da API, p.ex. `https://${{domus-back.RAILWAY_PUBLIC_DOMAIN}}` |

Não definir `HOST`. Não apontar `VITE_DOMUS_API_BASE_URL` para `*.railway.internal` — o browser não resolve a rede privada.

Na API do mesmo ambiente, a origem CORS deve ser a URL **pública** deste serviço:

```text
Cors__Origins__0=https://${{domus-front.RAILWAY_PUBLIC_DOMAIN}}
```

Redirect URIs no Logto usam a mesma origem pública do SPA.
