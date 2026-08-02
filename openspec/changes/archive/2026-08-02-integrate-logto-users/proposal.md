## Why

Domus needs a validated identity boundary before any household domain work: authentication via the existing Logto IdP, a Domus User linked to the OIDC subject, and proof that a valid login does not by itself grant product access. This is the first capability milestone and unblocks every later domain feature that depends on a resolved caller.

## What Changes

- Introduce the `users` capability: a Domus User identified by Domus `id` and linked to an external identity via `identity_id` (OIDC `sub`).
- Integrate the frontend with Logto for OIDC login (PKCE), token acquisition, and authenticated API calls.
- Define the expected API contract for token validation, identity-to-User resolution, `GET /me`, and an internal User provisioning endpoint (API implemented in a separate repository).
- Ensure authenticated identities are never auto-provisioned as Domus Users.
- Add frontend environment configuration for Logto and a future Domus API base URL.
- Explicitly exclude Houses, membership, roles, and other domain capabilities from this change.

## Capabilities

### New Capabilities
- `users`: Domus User lifecycle for identity integration — link to OIDC `sub`, no auto-provision on login, resolution of the authenticated identity to a Domus User, and observable auth outcomes for provisioned vs unprovisioned callers.

### Modified Capabilities
- _(none)_

## Impact

- **This repository (`front`)**: TanStack Start app scaffolding as needed, Logto/OIDC client integration, env vars (`VITE_LOGTO_*`, `VITE_DOMUS_API_BASE_URL`), auth UI flows, and client calls to the Domus API when available.
- **API repository (out of scope for implementation here)**: JWT validation against Logto, User persistence, internal provisioning endpoint, `GET /me` — documented as a contract dependency in design.
- **Logto preprod** (`https://logto-auth-preprod.up.railway.app/`): existing SPA application; API resource/audience assumed ready or configured alongside API work.
- **Dependencies**: Logto OIDC client for the frontend; no Domus-owned credential store.
- **Out of scope**: Houses, roles, membership, expenses, and any IdP Management API sync of profile data beyond what the frontend reads from tokens/claims at runtime.
