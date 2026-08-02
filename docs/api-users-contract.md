# Domus API contract — Users / identity (front dependency)

This document is the cross-repo contract for the Users identity boundary.
Implementation of JWT validation and persistence lives in the API repository; this
frontend depends on these behaviors and orchestrates self-serve provisioning.

## Identity model

- Domus User fields for this milestone: `id` (Domus UUID/string) and `identity_id`.
- `identity_id` MUST equal the OIDC `sub` from Logto.
- Domus MUST NOT store credentials.
- A valid Logto login MUST NOT by itself create a Domus User (no IdP-side auto-create).
- Orphan Domus Users (provisioned, no House) are acceptable.

## JWT validation

- Validate access tokens issued by Logto preprod:
  - Issuer: `https://logto-auth-preprod.up.railway.app/oidc`
  - JWKS: `https://logto-auth-preprod.up.railway.app/oidc/jwks`
- Enforce expected API audience (`aud`) matching the Logto API resource.
- Missing/invalid token → HTTP `401`.

## Resolve caller

- Look up Domus User by `identity_id = token.sub`.
- At most one User per `identity_id`.
- Valid token + no User → HTTP `403` (recommended code: `user_not_provisioned`).
- Do **not** provision on read paths (`GET /me`).

## `GET /me`

- Auth: `Authorization: Bearer <access_token>`.
- `200` body:

```json
{
  "id": "<domus-user-id>",
  "identity_id": "<oidc-sub>"
}
```

- `401` — missing/invalid token
- `403` — authenticated at IdP, not provisioned in Domus

Path may be version-prefixed (e.g. `/v1/me`); this frontend calls `/me`.

## `POST /me` (self-serve provisioning)

- Auth: `Authorization: Bearer <access_token>`.
- Creates a Domus User for the authenticated token `sub` only (ignore any body `identity_id`).
- `201` — created; body `{ id, identity_id }`
- `409` — already provisioned for that `sub` (no second User)
- `401` — missing/invalid token

Operator-only internal provisioning is **not** required for first-time Domus access.

## Frontend orchestration

When the Domus API base URL is configured and the user is authenticated at Logto:

1. Call `GET /me`.
2. If `403` (unprovisioned), call `POST /me` with the same Bearer token (no confirmation step, no operator).
3. Treat `POST /me` `409` as success-equivalent for this flow and continue.
4. Call `GET /me` again and treat `200` as provisioned.

`GET /me` MUST remain free of create side effects; provisioning is always an explicit `POST /me`.

## Frontend env alignment

| Variable | Role |
|----------|------|
| `VITE_LOGTO_ENDPOINT` | Logto tenant URL |
| `VITE_LOGTO_APP_ID` | SPA application id |
| `VITE_LOGTO_API_RESOURCE` | API resource / audience for access tokens |
| `VITE_DOMUS_API_BASE_URL` | API base URL (e.g. `http://localhost:3001`) |
