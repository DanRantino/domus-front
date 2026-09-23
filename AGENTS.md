# Domus Frontend — Agent Entry Point

**Repository:** `domus-front` (local checkout often named `domus-web`; `package.json` name is `domus-web`).  
**Responsibility:** SPA only — React UI, client state, API client calls, i18n, and frontend tests. Do **not** change backend, database, or shared infra from this repo.

Reference branch for facts: `nonprod`.

## Layout (where code lives)

| Area | Path |
| --- | --- |
| Bootstrap | `index.html`, `src/main.tsx`, `src/App.tsx` |
| Routes / store | `src/app/router.tsx`, `src/app/store.ts`, `src/app/hooks.ts` |
| Features | `src/features/<name>/` (e.g. `dashboard`, `create-household`, `house-invitations`, `tasks`) |
| Pages (route shells) | `src/pages/` |
| Shared UI | `src/components/` (`app-chrome`, `brand`, `toast`) |
| API client / session | `src/api/` (RTK Query base, GraphQL helpers, `me`) |
| Auth UI guards | `src/auth/` (cookie/BFF session; no Logto tokens in the browser) |
| Theme / tokens | `src/theme/` |
| i18n | `src/i18n/` (default `pt-BR`, fallback `en`) |
| Tests helpers | `src/test/` |
| Import alias | `#/*` → `src/*` (also `@` in Vite) |

Capability behavior specs: `openspec/specs/` (and change proposals under `openspec/changes/`).  
**Note:** `.cursor/rules/workflow.mdc` mentions `specs/<capability>/`; the real path is `openspec/specs/`. Prefer the tree and `product.mdc`.

## Commands (from `package.json`)

```bash
npm install
npm run dev            # Vite
npm run build          # typecheck + vite build
npm run typecheck      # tsc -p tsconfig.app.json --noEmit
npm test               # vitest run
npm run test:watch
npm run test:coverage
npm run lint
npm run lint:fix
npm run format         # prettier --write .
npm run format:check
npm run storybook      # port 6006
npm run build-storybook
npm run preview        # inspect dist/ locally only
```

Local env: copy `.env.example` → `.env.local`. Variable name used in the bundle: `VITE_DOMUS_API_BASE_URL` (typically `/api`). Do not invent other secret workflows.

## Specialized docs (link, do not duplicate)

| Topic | Location |
| --- | --- |
| Visual / design system | [`docs/design.md`](docs/design.md) |
| Product overview (when needed) | [`docs/product/domus-overview.md`](docs/product/domus-overview.md) |
| Frontend engineering conventions | [`.cursor/rules/frontend.mdc`](.cursor/rules/frontend.mdc) |
| Architecture principles | [`.cursor/rules/architecture.mdc`](.cursor/rules/architecture.mdc) |
| Branching / PR base | [`.cursor/rules/branching.mdc`](.cursor/rules/branching.mdc) (`nonprod`) |
| Workflow / context scope | [`.cursor/rules/workflow.mdc`](.cursor/rules/workflow.mdc) |
| Local setup notes | [`README.md`](README.md) |

`.cursor/rules/testing.mdc` exists but is empty — use Vitest patterns under `src/**` and existing `*.test.tsx` files instead.

There is no separate `docs/agents/` index in this repo; this file is the frontend entry point.

## Shared / cross-repo context (on demand only)

Lives in the **`domus-dev`** repository (sibling checkout). Do **not** load these by default for pure UI work:

- Shared context: [`../domus-dev/docs/agents/CONTEXT.md`](../domus-dev/docs/agents/CONTEXT.md)
- Role guidance: [`../domus-dev/docs/agents/ROLES.md`](../domus-dev/docs/agents/ROLES.md)
- Topic index: [`../domus-dev/docs/agents/INDEX.md`](../domus-dev/docs/agents/INDEX.md)

Backend entry (when the task needs API contracts): [`../domus-api/AGENTS.md`](../domus-api/AGENTS.md).

## What to read (task-scoped)

**Dashboard / UI component change**

1. This file.
2. The feature under `src/features/…` (and related `src/pages/` / `src/components/`).
3. [`.cursor/rules/frontend.mdc`](.cursor/rules/frontend.mdc); [`docs/design.md`](docs/design.md) if visuals change.

Do **not** load database, deployment, or authentication deep-dives by default.

**Cross-repo contract / API shape change**

1. This file + the frontend call sites (`src/api/`, feature `*/api/`).
2. Then shared context in `domus-dev` and the backend entry point in `domus-api`.

**Auth / session / cookie BFF behavior**

Only when the task touches login, session, or `credentials: 'include'` paths — start from `src/auth/`, `src/api/baseQuery.ts`, and README auth notes. Do **not** open backend, database, or deployment docs unless the BFF/API contract itself changes.

## Constraints

- Scope changes to this frontend repo unless the task explicitly requires another.
- Branch from `nonprod`; open PRs against `nonprod` (see branching rule).
- Prefer RTK Query for server state; RHF + Zod for forms; i18n for user-facing copy; MUI + design tokens for UI.
- Do not add Logto client tokens or `VITE_LOGTO_*` — auth is BFF/cookie via same-origin `/auth` and `/api`.
- Do not commit secrets; reference env **names** only.
- Keep diffs focused; follow existing feature folder patterns.
- Static checks before handoff: `npm run typecheck`, `npm run lint`, `npm test` (as relevant to the change).
