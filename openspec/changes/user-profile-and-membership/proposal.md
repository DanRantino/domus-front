## Why

The Domus API now exposes a richer current-user representation (`full_name`, `settings`, `houses`) plus `PATCH /me` and `PATCH /me/settings`, but the frontend still treats a provisioned user as `{ id, identity_id }` on a single Home surface with system-only theming. Users need a real Home summary and a Settings page that can edit profile preferences, apply theme immediately, and change passwords via the Identity Provider Account API without leaving Settings.

## What Changes

- Expand the frontend current-user model and API client to the provisioned representation: `id`, `identity_id`, `full_name`, `settings` (`theme`, `notifications`), and `houses` (membership summaries).
- Add authenticated Settings route (`/settings`) for editing `full_name`, theme, and notification toggles, with real `PATCH /me` / `PATCH /me/settings` submissions.
- Apply persisted theme preference in the UI (`light` / `dark` / `system`), replacing system-only theming.
- Evolve Home (`/`) into a read-only summary of `full_name` and House memberships (no settings editors on Home).
- Add Settings to shell navigation with active-route indication; introduce shared authenticated layout chrome for Home and Settings.
- Offer password change via Identity Provider Account REST API from the Settings form (no Domus password API).
- Add form UI primitives needed for Settings (e.g. input, label, switch/radio) as justified by this surface.

## Capabilities

### New Capabilities

- (none)

### Modified Capabilities

- `users`: Current-user representation, Home summary with memberships, Settings editing flows (`PATCH /me`, `PATCH /me/settings`), and IdP Account API password change from Settings.
- `design-system`: Color scheme follows user theme preference (`light` / `dark` / `system`) instead of system setting alone; shell navigation includes Settings alongside Home.

## Impact

- Frontend: `src/lib/domus-api/*`, `src/features/users/*`, `src/components/layout/*`, new `/settings` route, theme application on document root, shadcn form primitives as needed.
- Specs: `openspec/specs/users`, `openspec/specs/design-system`.
- External: Domus API `GET/PATCH /me`, `PATCH /me/settings` (assumed available); Logto Account API password + verification endpoints (configuration).
- Unaffected: House create/add/invite write APIs; Domus password storage; inventing notification delivery channels beyond preference persistence.
