## 1. API client

- [x] 1.1 Add a Domus API client helper for `POST /me` that sends the Bearer access token and interprets `201`, `409`, and `401`
- [x] 1.2 Keep `GET /me` free of provisioning side effects

## 2. Resolution flow

- [x] 2.1 Update me-resolution so that an unprovisioned result triggers a single-flight `POST /me` then re-fetches `GET /me`
- [x] 2.2 Treat `POST /me` `409` as continue-to-refetch, not a user-facing failure
- [x] 2.3 Surface non-409 provisioning failures as an error resolution state

## 3. UI and docs

- [x] 3.1 Remove operator-gated “ask an operator / no access” primary copy from the authenticated unprovisioned path
- [x] 3.2 Show a brief resolving/provisioning state while silent self-serve runs, then the provisioned User view on success
- [x] 3.3 Update `docs/api-users-contract.md` to describe self-serve `POST /me` and frontend orchestration (no operator requirement)

## 4. Verification

- [ ] 4.1 Manually verify: authenticated user without Domus User becomes provisioned without confirmation or operator steps
- [ ] 4.2 Manually verify: already-provisioned user still resolves via `GET /me` → 200 without unnecessary errors
