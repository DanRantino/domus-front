## Context

See proposal.md for motivation. This repository is greenfield frontend (`front`) with OpenSpec scaffolding and product/architecture rules; there is no Domus application code yet. Authentication is delegated to Logto at `https://logto-auth-preprod.up.railway.app/` (OIDC issuer `.../oidc`). The Domus API lives in a separate repository and is not implemented here. Architecture requires OIDC concepts over Logto-specific APIs where practical, `identity_id` = OIDC `sub`, and no automatic Domus access from IdP authentication alone.

## Goals / Non-Goals

**Goals:**

- Establish frontend OIDC login against the existing Logto SPA application.
- Wire env-based configuration for Logto and a future Domus API base URL.
- Document and depend on a clear API contract for JWT validation, User resolution, `GET /me`, and internal provisioning.
- Validate the three auth outcomes: 401 (no/invalid token), 403 (valid token, no User), 200 (provisioned User).
- Keep domain surface limited to User `id` + `identity_id`.

**Non-Goals:**

- Implementing the Domus API or database in this repository.
- Houses, membership, roles, or any household authorization model.
- Syncing IdP profile fields into Domus persistence.
- Using Logto roles/organizations as Domus authorization.
- Self-serve registration or invite flows (provisioning is internal-only for this milestone).

## Decisions

### D1: Capability boundary — `users` + integration design
**Choice:** One OpenSpec capability `users` for domain behavior; OIDC/Logto wiring, env, and cross-repo API contract live in this design.  
**Why:** Avoids a premature second capability (`identity`/`auth`) while keeping domain requirements free of framework details.  
**Alternatives:** Separate `identity` capability — deferred until auth concerns outgrow Users.

### D2: Repository split — frontend here, API elsewhere
**Choice:** Implement only the frontend in this change; treat API behaviors as a contract dependency.  
**Why:** Matches ownership (API in another repo) while still specifying observable outcomes the frontend relies on.  
**Alternatives:** Monorepo API+front in one change — rejected for current repo layout.

### D3: Token model — Logto-issued Bearer access tokens
**Choice:** SPA (or Start client) uses authorization code + PKCE; API calls use `Authorization: Bearer <access_token>` issued by Logto for the Domus API resource. Domus does not invent its own session/token format.  
**Why:** Logto already issues OIDC tokens; validation is standard JWT/JWKS against the Logto issuer.  
**Alternatives:** BFF cookie session in TanStack Start — more moving parts for this milestone; revisit if XSS/token storage becomes a hard requirement.

### D4: Minimal Domus User
**Choice:** Persist only Domus `id` and `identity_id` (`sub`) for this milestone. Display claims (name/email) may be read at runtime from the IdP token/userinfo in the frontend, not duplicated into Domus.  
**Why:** Matches architecture (“do not duplicate identity information unless required”).  
**Alternatives:** Cache email/name in Domus — deferred until a domain/ops need appears.

### D5: Provisioning via internal API endpoint
**Choice:** `POST` (or equivalent) internal provisioning endpoint creates a User for a given `identity_id`. Login never creates Users.  
**Why:** Explicit, testable, and satisfies “authenticated ≠ provisioned” while enabling the happy path without Houses/invites.  
**Alternatives:** DB seed-only — weaker operational path; allowlist/self-serve — out of scope for now.  
**Note:** Protection of the internal endpoint (network, shared secret, admin-only) is an API-repo concern; this front change only assumes Users can be created before E2E validation.

### D6: Current-user contract
**Choice:** `GET /me` (path may be version-prefixed by the API) returns `{ id, identity_id }` on success.  
**Status mapping:**
- Missing/invalid token → `401`
- Valid token, no User → `403` (optionally stable error code e.g. `user_not_provisioned`)
- Valid token + User → `200`  
**Why:** Separates authentication failure from provisioning failure so the frontend can show a distinct no-access state.

### D7: Frontend stack and configuration
**Choice:** TanStack Start + Logto OIDC client; env vars:
- `VITE_LOGTO_ENDPOINT` — Logto tenant URL (preprod filled)
- `VITE_LOGTO_APP_ID` — SPA application id
- `VITE_LOGTO_API_RESOURCE` — API audience/resource indicator
- `VITE_DOMUS_API_BASE_URL` — Domus API base URL (placeholder until API exists)  
**Why:** Aligns with frontend conventions; keeps secrets/config out of code. Commit `.env.example`; local overrides in `.env.local` (gitignored).  
**Logto premise:** SPA application already created in Admin Console; API resource configured as part of API readiness.

### D8: Frontend behavior when API is unavailable
**Choice:** Ship login/logout and token handling against Logto first; call `GET /me` when `VITE_DOMUS_API_BASE_URL` is set. Until the API exists, the UI may stop at “authenticated at IdP” and document the `/me` integration as the completion gate for the milestone.  
**Why:** Unblocks frontend auth work without blocking on the other repo.  
**Trade-off:** Full acceptance criteria (401/403/200) require the API; tasks split “Logto-ready front” vs “wire `/me` when API URL is configured.”

## Risks / Trade-offs

- **[Risk] API lag** → Frontend validates Logto login independently; `/me` wiring gated on `VITE_DOMUS_API_BASE_URL` and API readiness.  
- **[Risk] Wrong/missing API resource audience** → Access tokens fail API validation; keep `VITE_LOGTO_API_RESOURCE` explicit and verify `aud` with API team.  
- **[Risk] Accidental auto-provision later** → Spec forbids it; API must not create Users on `/me`.  
- **[Risk] Token storage XSS on SPA** → Accept for milestone; revisit BFF if threat model tightens.  
- **[Trade-off] Cross-repo contract only** → Drift possible; keep `GET /me` + provisioning semantics minimal and shared via this design until an OpenAPI artifact exists.

## Migration Plan

1. Confirm Logto SPA app id and API resource values; fill `.env.local` from `.env.example`.
2. Scaffold/implement frontend auth against Logto.
3. API repo implements User store, JWT validation, internal provision, `GET /me`.
4. Set `VITE_DOMUS_API_BASE_URL`; verify 401 / 403 / 200 paths end-to-end.
5. Rollback: disable API base URL or revert frontend auth routes; IdP users remain untouched in Logto.

## Open Questions

- Exact internal provisioning path and auth mechanism for that endpoint (API-repo decision; does not change Users requirements).
- URL prefix/versioning for `GET /me` (e.g. `/me` vs `/v1/me`) — confirm with API when it lands.
