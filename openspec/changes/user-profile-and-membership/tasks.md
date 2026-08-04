## 1. Current-user API contract

- [x] 1.1 Expand Zod/`DomusUser` types for `full_name`, `settings` (`theme`, `notifications`), and `houses` (`id`, `name`, `role`)
- [x] 1.2 Update `GET /me` parsing to require the expanded success payload
- [x] 1.3 Add `PATCH /me` client helper for `full_name` updates (including clear → null/empty)
- [x] 1.4 Add `PATCH /me/settings` client helper for partial theme/notifications updates
- [x] 1.5 Align `docs/api-users-contract.md` with expanded `/me` reads and PATCH operations

## 2. Theme application

- [x] 2.1 Switch design tokens to class-capable dark mode (document root class) while preserving `system` → `prefers-color-scheme`
- [x] 2.2 Apply theme from provisioned `settings.theme` as soon as `/me` resolves; fall back to system beforehand
- [x] 2.3 Re-apply theme immediately after successful `PATCH /me/settings` theme changes

## 3. Shell, layout, and navigation

- [x] 3.1 Add shadcn primitives needed for Settings: `input`, `label`, and `switch` (or equivalent boolean control)
- [x] 3.2 Introduce shared authenticated layout owning AppShell/Sidebar, sign-out, and provisioned gate for `/` and `/settings`
- [x] 3.3 Add Settings nav entry to Sidebar with active state on `/settings`
- [x] 3.4 Keep welcome/bootstrap/failure surfaces outside the provisioned layout path

## 4. Home and Settings surfaces

- [x] 4.1 Rebuild Home as read-only summary of `full_name` (set/unset) and `houses` (empty state when none)
- [x] 4.2 Create `/settings` route with sections for profile name, theme, notifications, and password
- [x] 4.3 Wire full_name explicit save to `PATCH /me` and refresh current-user cache on success
- [x] 4.4 Wire theme and notification toggles to submit `PATCH /me/settings` on change; revert/show error on failure
- [x] 4.5 Add Change password form on Settings that calls Logto Account API (`VITE_LOGTO_PASSWORD_URL`) with OP Bearer token after current-password verification (env + `.env.example`)

## 5. Verification

- [x] 5.1 Manually verify provisioned Home shows name/memberships and has no settings editors
- [x] 5.2 Manually verify Settings persists name, theme, and notification toggles against the API
- [x] 5.3 Manually verify forced light/dark/system theme apply without full reload
- [x] 5.4 Manually verify Settings nav active state and password Account API submit UX; unauthenticated/welcome paths still work

## 6. Layered users feature + password REST alignment

- [x] 6.1 Refactor `src/features/users` into `data` / `services` / `hooks` / `hoc` / `components` layers (Settings, Home, session/me)
- [x] 6.2 Keep routes thin: route → HOC → presentational
- [x] 6.3 Rename env to `VITE_LOGTO_PASSWORD_URL` and document as REST password endpoint (not redirect)
- [x] 6.4 Update `docs/api-users-contract.md` and OpenSpec password requirements for IdP REST from Settings
