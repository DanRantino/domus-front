## 1. Tooling hygiene and Tailwind

- [x] 1.1 Ensure a clean npm-only dependency tree (`package-lock.json` as source of truth; remove pnpm residue if present) without changing application behavior
- [x] 1.2 Add `tailwindcss` and `@tailwindcss/vite` via npm and register the Tailwind Vite plugin in `vite.config.ts`
- [x] 1.3 Update `src/styles.css` to import Tailwind and apply tokenized base styles on `html`/`body` (warm surface background, neutral text, Manrope body) without breaking existing routes

## 2. shadcn, tokens, and primitives

- [x] 2.1 Initialize shadcn (`components.json`, `src/lib/utils.ts` `cn()`, aliases under `@/`, `rsc: false`, CSS variables) using npm/`npx`
- [x] 2.2 Map brand anchors (`#4A6741`, `#C67B5C`, `#EFEBE3`, `#2D2D2D`) plus supporting outline/muted/error tokens into the shadcn/Tailwind theme in `src/styles.css`
- [x] 2.3 Load Newsreader (headings) and Manrope (UI/body) with sensible `font-display` and system fallbacks
- [x] 2.4 Add only the justified shadcn components: `button`, `card`, `alert`, `progress`, `avatar`, `separator`

## 3. Layout shell and auth surfaces

- [x] 3.1 Create a reusable authenticated application shell (brand presence, primary content region, account/sign-out) with no fake domain navigation
- [x] 3.2 Split auth presentation by state (config missing, session loading, welcome, Domus User bootstrap, failure variants, provisioned profile) without changing `useLogto`, `useMeResolution`, or API client behavior
- [x] 3.3 Build the unauthenticated welcome surface (hero-level Domus brand, short supporting message, sign-in CTA) using design-system primitives
- [x] 3.4 Build intentional loading/bootstrap presentations for IdP session check and Domus User resolution
- [x] 3.5 Build intentional failure/no-access presentations (missing Logto config, auth failure, API/resolution failures) with clear recovery actions where applicable
- [x] 3.6 Build the provisioned lightweight profile inside the shell using real `/me` data only (no fabricated settings, roles, or household fields)
- [x] 3.7 Align `/callback` and provider fallback loading/error copy with the same visual language

## 4. Verification

- [x] 4.1 Verify unauthenticated → sign-in → callback → provisioned `/me` still works end-to-end
- [x] 4.2 Verify loading and failure paths (Logto unset, API unset/error, auth failure) render intentional surfaces
- [x] 4.3 Spot-check welcome and shell on a common mobile width for readability and operability without horizontal scrolling
