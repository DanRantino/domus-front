## Why

After Logto login, the frontend currently treats `GET /me` → 403 as a dead-end that asks the user to wait for an operator. The Domus API already supports authenticated self-serve provisioning via `POST /me`, so requiring an operator adds friction without a product benefit. Orphan Domus Users (provisioned, no House yet) are acceptable until Houses land.

## What Changes

- **BREAKING** (UX): Stop presenting operator-gated “no access” as the primary path for unprovisioned callers.
- When the caller is authenticated at Logto and `GET /me` reports unprovisioned (403), the frontend MUST call `POST /me` with the same access token (without requiring a user confirmation step), then re-resolve via `GET /me`.
- Align frontend docs/contract copy with self-serve `POST /me` (not operator-only internal provisioning).
- Keep Login / `GET /me` free of side-effect provisioning: creation remains an explicit `POST /me` call initiated by the frontend after a 403, not a Logto login side effect and not a mutation inside `GET /me`.

## Capabilities

### New Capabilities
- _(none)_

### Modified Capabilities
- `users`: Replace operator/internal-only provisioning expectations and the “show not-provisioned / ask operator” frontend UX with silent self-serve provisioning through `POST /me` after an unprovisioned `GET /me` result.

## Impact

- **This repository (`front`)**: `me` resolution flow, AuthPanel / unprovisioned UI, Domus API client (`POST /me`), and `docs/api-users-contract.md` (and related copy).
- **API repository (`back`)**: no required behavior change; `POST /me` already implements self-serve create (`201` / `409`).
- **Out of scope**: Houses/membership, Domus profile fields, auto-create inside `GET /me`, Logto webhooks.
