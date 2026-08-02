## Why

The Domus frontend has working Logto authentication and `/me` resolution, but presentation is still utilitarian browser-default CSS with no shared visual language. An approved Stitch direction (warm minimalism, forest/terracotta, Newsreader + Manrope) is ready to land as a lightweight Tailwind + shadcn foundation so auth surfaces and future capabilities share one identity without inventing a large custom design-system framework.

## What Changes

- Introduce a frontend design-system foundation: Tailwind CSS v4, shadcn/ui (minimal subset), centralized design tokens, and typography (Newsreader headings, Manrope UI/body).
- Restyle existing authentication and Domus User resolution states into intentional surfaces (welcome, loading, failure, authenticated shell with lightweight `/me` profile).
- Add a reusable authenticated application shell with brand presence, primary content region, and account/sign-out — without fake domain navigation.
- Prefer shadcn primitives for low-level UI; compose app-specific layout only where needed.
- Treat Stitch as visual direction (layout, tokens, component appearance), not as code or product requirements to copy.

## Capabilities

### New Capabilities
- `design-system`: Centralized design tokens, Tailwind/shadcn configuration, typography, minimal reusable UI primitives, and authenticated application shell for Domus frontend surfaces.

### Modified Capabilities
- `users`: Frontend presentation of authentication and Domus User resolution states MUST use intentional design-system surfaces (unauthenticated welcome, bootstrap/loading, failure, authenticated shell with lightweight profile) without changing the Logto → token → `/me` contract.

## Impact

- **This repository (`front`)**: Global styles/tokens, Vite Tailwind plugin, `components.json`, shadcn UI under `src/components/ui`, layout shell, and restyling of `AuthPanel` / related routes (`/`, `/callback`).
- **Dependencies (npm only)**: `tailwindcss`, `@tailwindcss/vite`, shadcn CLI-managed primitives and their peers (`clsx`, `tailwind-merge`, `class-variance-authority`, `lucide-react`, Radix packages as required by added components). No pnpm/yarn/Bun.
- **Unaffected**: Logto OIDC integration, access-token handling, Domus API client contracts (`GET /me`, `POST /me`), and all House/domain capabilities (out of scope; no fake business logic).
- **Visual references**: Stitch project “Domus Household Operating System”; brand anchors primary `#4A6741`, secondary `#C67B5C`, warm surface `#EFEBE3`, neutral `#2D2D2D`; Stitch Material ladder may inform supporting tokens only.
