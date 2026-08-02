## 1. Project and environment

- [x] 1.1 Scaffold TanStack Start + TypeScript app structure if not already present
- [x] 1.2 Add `.gitignore` entries for `.env` / `.env.local` and commit `.env.example` with `VITE_LOGTO_ENDPOINT`, `VITE_LOGTO_APP_ID`, `VITE_LOGTO_API_RESOURCE`, and `VITE_DOMUS_API_BASE_URL`
- [x] 1.3 Document required local env values (Logto preprod endpoint prefilled; app id and API resource from Admin Console)

## 2. Logto / OIDC frontend auth

- [x] 2.1 Add Logto (or OIDC) client dependency and provider wired to env endpoint + app id
- [x] 2.2 Implement login (authorization code + PKCE) and logout against Logto
- [x] 2.3 Request access tokens for `VITE_LOGTO_API_RESOURCE` when that env value is set
- [x] 2.4 Add callback / redirect route(s) matching the Logto SPA application configuration
- [x] 2.5 Show a minimal authenticated vs unauthenticated UI state using IdP session/tokens (without requiring Domus User)

## 3. Domus API client (front)

- [x] 3.1 Create an API client that uses `VITE_DOMUS_API_BASE_URL` and attaches `Authorization: Bearer <access_token>`
- [x] 3.2 Implement `GET /me` (or agreed path) client call returning Domus `id` + `identity_id`
- [x] 3.3 Map HTTP 401 / 403 / 200 to distinct frontend states (unauthenticated, not provisioned, provisioned)
- [x] 3.4 Gate `/me` calls when `VITE_DOMUS_API_BASE_URL` is empty so Logto-only progress remains usable

## 4. Unprovisioned and provisioned UX

- [x] 4.1 Render a clear no-access / not-provisioned view when `/me` returns 403
- [x] 4.2 Render a minimal provisioned view when `/me` returns 200 with Domus User identifiers
- [x] 4.3 Ensure login alone never implies Domus User access in the UI

## 5. Verification

- [x] 5.1 Manually verify Logto login/logout and token acquisition against preprod
- [ ] 5.2 When API is available: verify 401 (no/invalid token), 403 (valid token, no User), 200 (provisioned User) against `/me`
- [x] 5.3 Confirm no frontend path auto-creates a Domus User

## 6. Cross-repo contract checklist (API — not implemented here)

- [x] 6.1 Share with API repo: JWT validation via Logto issuer/JWKS, `identity_id` = `sub`, no auto-provision on `/me`
- [x] 6.2 Share with API repo: internal provisioning endpoint creates User by `identity_id`; duplicates rejected
- [x] 6.3 Share with API repo: `GET /me` status contract 401 / 403 / 200 and response shape `{ id, identity_id }`
