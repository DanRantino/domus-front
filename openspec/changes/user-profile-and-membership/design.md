## Context

See proposal.md for motivation. Today the frontend resolves a provisioned user as `{ id, identity_id }`, renders a lightweight profile only on `/` via `AuthPanel` surfaces that each wrap `AppShell`, and applies color scheme solely through `prefers-color-scheme` CSS. The Domus API contract now returns `full_name`, `settings`, and `houses`, and exposes `PATCH /me` and `PATCH /me/settings`. Shell navigation already has Home; Settings is the second real authenticated destination.

## Goals / Non-Goals

**Goals:**

- Shared authenticated layout so Home and Settings reuse one shell/gate without duplicating chrome.
- Typed current-user client aligned with the expanded `/me` representation.
- Settings that persist and immediately apply theme; notification toggles that submit to the API.
- Home as read-only summary (`full_name`, `houses`).
- Password change via Logto Account REST API from the Settings form (no Domus password API).

**Non-Goals:**

- House create/add/invite write UX.
- Implementing notification delivery channels.
- Domus-owned password APIs.
- Multi-brand theming or per-House themes.

## Decisions

### D1: Path-based authenticated layout route

**Choice:** Introduce a shared authenticated layout (TanStack file-route layout) that owns `AppShell` / Sidebar, sign-out, and provisioned-gate behavior for `/` and `/settings`. Keep unauthenticated welcome/bootstrap/failure surfaces outside that layout (or redirected before layout content).

**Why:** Second authenticated page is the trigger identified in design-system v0; wrapping shell only inside provisioned surfaces does not scale to Settings.

**Alternatives considered:** Keep wrapping `AppShell` in every surface — duplicates nav/active state; nest Settings under AuthPanel without a route — fights deep-linking and active nav.

### D2: Theme via class strategy on the document root

**Choice:** Drive semantic light/dark tokens with a document-level class (e.g. `.dark` on `<html>`) while `theme === 'system'` continues to follow `prefers-color-scheme`. Apply the resolved scheme as soon as provisioned settings are known and again after successful `PATCH /me/settings`.

**Why:** Specs require immediate apply for explicit light/dark; CSS-only media queries cannot honor forced light while the OS is dark.

**Alternatives considered:** Keep media-query-only (rejected — cannot force light/dark); persist theme only in localStorage without API (rejected — API is source of truth).

### D3: Settings persistence granularity

**Choice:** Theme and each notification toggle submit promptly via `PATCH /me/settings` on change (partial payloads). `full_name` uses an explicit save action on Settings calling `PATCH /me` (supports clear → null/empty). Optimistic UI is optional; on failure, revert local control state and show an error.

**Why:** Matches “toggles now and data must be submitted”; avoids accidental name clears on every keystroke.

**Alternatives considered:** Single Save for the whole page — slower feedback for toggles; autosave name on blur — easier to clear accidentally.

### D4: Expand Zod current-user schema and invalidate/reuse me query

**Choice:** Extend `domusUserSchema` (and related types) for `full_name`, `settings`, `houses`. Add `patchMe` / `patchMeSettings` client helpers. Keep `useMeResolution` (or successor query) as the cache; Settings mutations update that cache from success envelopes.

**Why:** One representation feeds Home and Settings; avoids divergent local copies.

**Alternatives considered:** Separate settings query — unnecessary while `/me` already returns settings.

### D5: IdP password via Account REST API from Settings

**Choice:** Configure the Logto Account API password endpoint via `VITE_LOGTO_PASSWORD_URL` (documented in `.env.example`). Settings keeps a password form that: (1) verifies the current password via `POST /api/verifications/password` on the Logto endpoint, then (2) `POST`s the new password to the configured Account API URL with Bearer OP token and `logto-verification-id`. Domus never receives or stores password material.

**Why:** Spec forbids Domus password endpoints; the Account API is IdP-owned. Calling REST from Settings keeps UX in-app without inventing a Domus `/password` route.

**Alternatives considered:** Browser redirect to Logto account experience — rejected once the env value was recognized as a REST endpoint; hard-code Logto path — brittle across tenants; omit password UX — weaker Settings completeness for this milestone.

### D6: Add only justified form primitives

**Choice:** Add shadcn `input`, `label`, and `switch` (theme may use radio group or segmented control built from existing button styles if cleaner; boolean prefs use switch). Do not add a full settings-kit museum.

**Why:** Specs require shared primitives for Settings controls.

## Risks / Trade-offs

- **[Risk] API envelope/field drift vs frontend Zod** → Parse strictly; surface validation errors; keep `docs/api-users-contract.md` aligned.
- **[Risk] Theme flash before `/me` resolves** → Fall back to system until provisioned settings load; apply as soon as available.
- **[Risk] Layout refactor regresses auth states** → Keep welcome/failure outside provisioned layout; manually verify login → home → settings → sign-out.
- **[Trade-off] Notification toggles without delivery** → Prefs persist early; product copy should not imply notifications already fire.
- **[Trade-off] Class-based dark mode** → Slightly more JS than pure CSS; required for forced light/dark.

## Migration Plan

1. Expand API types/client and docs contract for `/me` + PATCH operations.
2. Add theme applicator + design-token class strategy; keep system fallback.
3. Introduce authenticated layout + Settings route + Sidebar Settings link.
4. Rebuild Home summary; implement Settings forms/mutations.
5. Verify provisioned Home/Settings, theme apply, toggle persistence, password Account API submit, and unauthenticated paths.
6. Rollback is git revert of the feature layer; no data migration on the frontend.

## Open Questions

- (none for password endpoint shape; document `VITE_LOGTO_PASSWORD_URL` per environment.)
