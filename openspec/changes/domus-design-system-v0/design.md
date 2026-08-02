## Context

See proposal.md for motivation and success criteria.

The frontend already has a working Logto → access token → `GET /me` / silent `POST /me` path, centered on `AuthPanel` and related users feature modules, with only browser-default styling in `styles.css`. There is no Tailwind, no shadcn, no shared token layer, and no application shell.

Constraints that shape the approach:

- Authentication architecture and API contracts must remain unchanged.
- Package manager remains npm only.
- No House/domain capabilities may land with fake business logic.
- Stitch mockups are visual references, not pixel-perfect or code-to-copy requirements.
- Keep the stack small: React 19 + TanStack Start/Router/Query as today.

Stitch project “Domus Household Operating System” informs atmosphere and component patterns (bootstrap, error cards, shell chrome, profile layout). Brand anchors confirmed for this change: primary `#4A6741`, secondary `#C67B5C`, warm surface `#EFEBE3`, neutral `#2D2D2D`, Newsreader + Manrope. Stitch Material named-color ladders may inform supporting tokens (outline, muted, error) only.

## Goals / Non-Goals

**Goals:**

- Establish Tailwind v4 + shadcn as the styling/component foundation.
- Centralize brand tokens and map them to shadcn semantic theme variables.
- Support light and dark semantic themes driven by the system color scheme.
- Replace utilitarian auth UI with intentional welcome, loading, failure, and provisioned-profile surfaces.
- Introduce a reusable authenticated shell (brand + content + account/sign-out) without fake domain nav.
- Keep desktop and mobile usable without a separate design track.

**Non-Goals:**

- Installing the full shadcn catalog.
- Manual theme toggle or multi-brand theming.
- House create/join/invite flows, domain settings, or fabricated profile fields.
- Changing Logto configuration, token handling, or `/me` resolution semantics.
- Copying Stitch-generated HTML as application architecture.
- Storybook or a separate design-system package.

## Decisions

### 1. Tailwind CSS v4 via `@tailwindcss/vite`

**Choice:** Add `tailwindcss` and `@tailwindcss/vite`, wire the Vite plugin alongside the existing TanStack Start / React plugins, and use CSS-first config (`@import "tailwindcss"` + `@theme` / CSS variables in `src/styles.css`). Do not introduce a legacy PostCSS-only Tailwind v3 setup.

**Why:** Matches Vite 8 already in the repo; shadcn’s current Vite path targets Tailwind v4; avoids outdated config assumptions.

**Alternatives considered:**

- Hand-rolled CSS tokens only (previous deferred approach) — rejected; product direction now standardizes on Tailwind + shadcn.
- Tailwind v3 + `tailwind.config.js` — unnecessary friction on this toolchain.

### 2. shadcn/ui as owned primitives, not a runtime framework

**Choice:** Initialize shadcn with `rsc: false`, CSS variables enabled, aliases under `@/` (`components`, `ui`, `lib`, `hooks`), components in `src/components/ui`, and `cn()` in `src/lib/utils.ts`. Keep `#/*` package imports for existing app code; shadcn code may use `@/`.

**Why:** Copy-in components stay editable and match Domus tokens; no opaque UI package version lock-in. TanStack Start here is not Next RSC.

**Alternatives considered:**

- Full hand-rolled primitives — more churn for alerts/progress/avatar already present in Stitch.
- External component library (MUI/Chakra) — heavier and less aligned with Tailwind-first direction.

### 3. Brand anchors override Stitch Material primary naming

**Choice:** Expose confirmed anchors as stable palette keys (`--palette-forest`, `--palette-terracotta`, `--palette-warm`, `--palette-charcoal`, plus dark companions). Map light/dark semantic variables (`--primary`, `--background`, `--foreground`, etc.) from those keys. Treat Stitch `primary`/`primary-container` Material split as reference only.

**Why:** Keeps a simple, approved brand story; avoids shipping two competing greens as “the” primary without product intent; gives one place to adjust brand hex without rewriting every semantic token.

**Alternatives considered:**

- Adopt full Stitch Material hex ladder as SSOT — richer but conflicts with confirmed `#C67B5C` / `#EFEBE3` anchors.
- Ignore Stitch supporting colors entirely — loses useful outline/error/surface steps.

### 4. System-driven dark mode via CSS only

**Choice:** Remap semantic tokens under `@media (prefers-color-scheme: dark)` with warm dark surfaces and bright primary/secondary keys. Set `color-scheme` accordingly. Do not add a theme toggle or persisted preference in this change. Brand mark SVG keeps fixed brand colors.

**Why:** Matches OS setting with zero JS; Tailwind `dark:` variants already follow `prefers-color-scheme` by default.

**Alternatives considered:**

- Class-based `.dark` + manual toggle — deferred; more product surface than needed now.
- Separate JS theme provider — unnecessary for system-only.

### 5. Minimal initial shadcn set

**Choice:** Add only components justified by in-scope Stitch patterns and current auth UX: `button`, `card`, `alert`, `progress`, `avatar`, `separator`. Defer `input`/`label` unless a real editable field ships; defer `badge`, `switch`, `sidebar`/`sheet` until needed.

**Why:** Specs require intentional surfaces now, not a component museum. Profile v0 is read-oriented around `/me` data.

**Alternatives considered:**

- Add full form/settings kit from the Stitch profile mock — invents unsupported product behavior.
- Sidebar package immediately — layout composition is enough for a nav-less shell.

### 6. Application shell as layout composition

**Choice:** Introduce `src/components/layout` (or equivalent) shell with brand chrome, main content region, and account/sign-out. Wrap authenticated provisioned (and other in-shell authenticated) views. Keep file routes essentially as-is (`/`, `/callback`); do not invent domain IA or fake nav items present in Stitch.

**Why:** Delivers reuse without pretending Houses/tasks exist. Later capabilities mount inside the same chrome; a path-based layout route can wait until a second authenticated page exists.

**Alternatives considered:**

- Copy Stitch sidebar with Home/Members/Tasks/Finances/Calendar — rejected (confirmed non-goal).
- Keep chrome only inside `AuthPanel` — fails reuse.

### 7. Restructure auth UI by state, keep resolution logic

**Choice:** Split presentation by observable state (config missing, session loading, welcome, IdP-authenticated bootstrap, failure variants, provisioned profile) while leaving `useLogto`, `useMeResolution`, and API client behavior intact.

**Why:** Specs require intentional surfaces per state; the risk is restyling a monolith. State-oriented views keep design-system work from rewriting auth.

**Alternatives considered:**

- Rewrite auth behind a new state machine — out of scope and higher regression risk.
- Pixel-port Stitch “Casa Furst” profile — fabricates fields and settings.

### 8. Screens in vs out of scope

**Choice:** Implement now: derived unauthenticated welcome; loading bootstrap (Stitch “Loading Authenticated User”); authentication/resolution failure (Stitch “Authentication Failure”); provisioned shell + lightweight `/me` profile (atmosphere from “Refined User Profile”, not fake settings). Leave House onboarding/invite/loading/failure screens as future work or explicit static placeholders only if later requested — no API invention.

**Why:** Matches existing Domus functionality; Stitch House screens are domain-ahead.

## Risks / Trade-offs

- **[Risk] Restyle regresses auth/`/me` flows** → Preserve resolution hooks; manually verify login → callback → provisioned and failure paths; keep presentation separate from `me-query`.
- **[Risk] Dirty node_modules / pnpm residue from prior attempts** → Clean install with npm (`package-lock.json` as source of truth) before adding deps.
- **[Risk] shadcn/Tailwind version mismatch** → Follow current shadcn Vite + Tailwind v4 docs at implementation time; pin versions in package.json.
- **[Risk] Scope creep from rich Stitch profile** → Specs forbid fabricated fields and fake nav; tasks list only justified components.
- **[Trade-off] Shell without real navigation** → Chrome may feel sparse until Houses exist; preferred over fake IA.
- **[Trade-off] CSS/theme tokens over typed JS token module** → Slightly weaker compile-time guarantees; simpler v0 and natural for Tailwind/shadcn.

## Migration Plan

1. Hygienize dependencies (npm-only clean tree).
2. Add Tailwind v4 plugin + base CSS import without changing auth behavior.
3. Init shadcn + theme token mapping + add minimal components.
4. Introduce shell and state-oriented auth surfaces; rebind `AuthPanel` / callback presentation.
5. Verify unauthenticated, loading, failure, and provisioned paths on desktop and a mobile width.
6. Rollback is a git revert of the UI/tooling layer; no API or IdP migration.

## Open Questions

- Exact shadcn style preset name available from the CLI at implement time (e.g. current default vs `radix-nova`) — pick the maintained default; does not change specs.
- Font delivery (Google Fonts link vs self-hosted) — either satisfies typography requirements.
