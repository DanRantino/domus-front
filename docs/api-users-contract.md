# Domus API contract — Users / identity (front dependency)

This document is the cross-repo contract for the Users identity boundary.
Implementation of JWT validation and persistence lives in the API repository; this
frontend depends on these behaviors and orchestrates self-serve provisioning,
profile updates, and settings.

## Identity model

- Domus User fields: `id`, `identity_id`, optional `full_name` (nullable), `settings`, and `houses`.
- `identity_id` MUST equal the OIDC `sub` from Logto.
- Domus MUST NOT store credentials.
- A valid Logto login MUST NOT by itself create a Domus User (no IdP-side auto-create).
- Orphan Domus Users (provisioned, no House) are acceptable.
- On create: `full_name` is null; `settings.theme` defaults to `system`; each notification
  category (`daily_tasks`, `expenses`, `family_chat`) defaults to `true`.

## JWT validation

- Validate access tokens issued by Logto preprod:
  - Issuer: `https://logto-auth-preprod.up.railway.app/oidc`
  - JWKS: `https://logto-auth-preprod.up.railway.app/oidc/jwks`
- Enforce expected API audience (`aud`) matching the Logto API resource.
- Missing/invalid token → HTTP `401`.

## Resolve caller

- Look up Domus User by `identity_id = token.sub`.
- At most one User per `identity_id`.
- Valid token + no User → HTTP `403` with failure envelope `error.code = not_provisioned`.
- Do **not** provision on read paths (`GET /me`).

## Current-user representation

Successful product outcomes for `/me` operations use the standard API success envelope.
`data` for a provisioned user:

```json
{
  "id": "<domus-user-id>",
  "identity_id": "<oidc-sub>",
  "full_name": null,
  "settings": {
    "theme": "system",
    "notifications": {
      "daily_tasks": true,
      "expenses": true,
      "family_chat": true
    }
  },
  "houses": [
    {
      "id": "<house-id>",
      "name": "<house-name>",
      "role": "admin"
    }
  ]
}
```

- `full_name` is `null` when unset.
- `theme` is one of `light`, `dark`, `system`.
- `houses` is `[]` when the user has no memberships. Each entry includes House `id`, `name`,
  and membership `role` (`admin` | `member` | `guest`).

## `GET /me`

- Auth: `Authorization: Bearer <access_token>`.
- `200` — success envelope with current-user representation in `data`
- `401` — missing/invalid token
- `403` — authenticated at IdP, not provisioned (`error.code = not_provisioned`)

Path may be version-prefixed (e.g. `/v1/me`); this frontend calls `/me`.

## `POST /me` (self-serve provisioning)

- Auth: `Authorization: Bearer <access_token>`.
- Creates a Domus User for the authenticated token `sub` only (ignore any body `identity_id`).
- `201` — created; success envelope with current-user representation (defaults + `full_name: null`)
- `409` — already provisioned (`error.code = already_exists`); no second User
- `401` — missing/invalid token

## `PATCH /me` (profile)

- Auth: `Authorization: Bearer <access_token>`.
- Body may include `full_name`. Omitting `full_name` leaves it unchanged.
- `full_name: null` or `""` clears the name (store `null`).
- `200` — success envelope with updated current-user representation
- `403` — not provisioned
- `401` — missing/invalid token

## `PATCH /me/settings`

- Auth: `Authorization: Bearer <access_token>`.
- Body may include `theme` and/or `notifications` (partial category keys allowed).
- Omitted top-level fields and omitted notification keys remain unchanged.
- Invalid `theme` → `400` with `error.code = validation_error`.
- `200` — success envelope with updated current-user representation
- `403` — not provisioned
- `401` — missing/invalid token

## Password change

- Domus MUST NOT expose a password update API and MUST NOT store credentials.
- The frontend changes passwords by calling the Logto Account API from Settings (staying on the page):
  1. `POST {VITE_LOGTO_ENDPOINT}/api/verifications/password` with `{ "password": "<current>" }` and Bearer OP access token → `verificationRecordId`
  2. `POST {VITE_LOGTO_PASSWORD_URL}` (typically `/api/my-account/password`) with `{ "password": "<new>" }`, Bearer OP access token, and header `logto-verification-id: <verificationRecordId>`
- The Domus API is never involved in password material.

## Frontend orchestration

When the Domus API base URL is configured and the user is authenticated at Logto:

1. Call `GET /me`.
2. If `403` (unprovisioned), call `POST /me` with the same Bearer token (no confirmation step).
3. Treat `POST /me` `409` as success-equivalent for this flow and continue.
4. Call `GET /me` again and treat `200` as provisioned.

`GET /me` MUST remain free of create side effects; provisioning is always an explicit `POST /me`.

## Frontend env alignment

| Variable | Role |
|----------|------|
| `VITE_LOGTO_ENDPOINT` | Logto tenant URL |
| `VITE_LOGTO_APP_ID` | SPA application id |
| `VITE_LOGTO_API_RESOURCE` | API resource / audience for access tokens |
| `VITE_LOGTO_PASSWORD_URL` | Logto Account API password endpoint (`POST /api/my-account/password`) |
| `VITE_DOMUS_API_BASE_URL` | API base URL (e.g. `http://localhost:3001`) |
