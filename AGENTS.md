# Domus Frontend — agent entry

**Repository:** `domus-front` (local checkout often named `domus-web`; `package.json` name is `domus-web`).
**Responsibility:** SPA only — React UI, client state, API calls, i18n, and frontend tests. Do not change backend, database, or shared infra from this repo.

## Commands

```bash
npm run typecheck
npm run lint
npm test
```

Other scripts (`dev`, `build`, Storybook) are in `package.json`. Bundle env name: `VITE_DOMUS_API_BASE_URL` (typically `/api`). Copy `.env.example` to `.env.local`.

## When to read

- Before editing `src/**/*.{ts,tsx}`: [`.cursor/rules/frontend.mdc`](.cursor/rules/frontend.mdc). Copy the nearest feature under `src/features/`.
- Visual changes: [`docs/design.md`](docs/design.md) and `src/theme/`.
- A new domain capability: [`.cursor/rules/product.mdc`](.cursor/rules/product.mdc).
- A new architectural pattern, auth, or identity: [`.cursor/rules/architecture.mdc`](.cursor/rules/architecture.mdc).
- Cross-repo work: [`../domus-dev/docs/agents/INDEX.md`](../domus-dev/docs/agents/INDEX.md), then one topic. Session flow: [`../domus-dev/docs/agents/auth.md`](../domus-dev/docs/agents/auth.md).

## Constraints

- RTK Query for server state; RHF + Zod for forms; i18n for user-facing copy; MUI and design tokens for UI.
- No Logto client tokens and no `VITE_LOGTO_*`. Session is the BFF cookie on same-origin `/auth` and `/api`.
- Branch from `nonprod`: [`.cursor/rules/branching.mdc`](.cursor/rules/branching.mdc).
- No secrets in git. Keep the change in this repo unless the task asks otherwise.
- Before handoff, run `npm run typecheck`, `npm run lint`, and `npm test` when they cover the change.
