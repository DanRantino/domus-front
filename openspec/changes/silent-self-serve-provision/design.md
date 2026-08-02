## Context

See proposal.md for motivation. The Domus API (`back`) already exposes `GET /me` (`401` / `403` / `200`) and self-serve `POST /me` (`201` / `409`) deriving `identity_id` from the token `sub`. This frontend still follows the earlier operator-gated unprovisioned UX and documents internal-only provisioning. Product decision: orphan Domus Users are acceptable; prefer silent self-serve (option B) over mutating `GET /me` or Logto webhooks.

## Goals / Non-Goals

**Goals:**

- After Logto auth, resolve Domus User with minimal friction: on `GET /me` → unprovisioned, automatically `POST /me`, then re-fetch.
- Remove operator-gated copy/paths from the primary UX.
- Keep API contract: reads do not create Users; creation is an explicit `POST /me`.

**Non-Goals:**

- Changing Domus API behavior or auto-provision inside `GET /me`.
- Houses, invites, profile completion forms.
- Logto Management API or login webhooks.

## Decisions

### D1: Silent client-side orchestration (option B)
**Choice:** Frontend orchestrates `GET /me` → on 403/`not_provisioned` → `POST /me` → `GET /me` again, without a confirmation click.  
**Why:** Matches “no operator” and low friction while preserving API invariants.  
**Alternatives:** Auto-create in `GET /me` (rejected — changes API/spec); keep operator UX (rejected); confirmation button (more friction than desired).

### D2: Treat `409` on `POST /me` as success-equivalent for resolution
**Choice:** If `POST /me` returns `409` (already provisioned), continue to re-fetch `GET /me` instead of showing an error.  
**Why:** Concurrent tabs / races should still converge to provisioned.  
**Alternatives:** Surface 409 as error — worse UX for a benign race.

### D3: Keep provisioning out of Logto callback route alone
**Choice:** Trigger provisioning from the authenticated me-resolution path (when API is configured), not as a side effect of IdP redirect handling itself.  
**Why:** Clear separation: Logto establishes identity; Domus resolution/provisioning happens when calling the API.  
**Alternatives:** Fire `POST /me` in `/callback` before any UI — acceptable variant, but me-resolution centralizes token + API gating already.

### D4: Update cross-repo contract docs in this repo
**Choice:** Update `docs/api-users-contract.md` (and UI copy) to describe `POST /me` self-serve and remove “frontend does not call provisioning / ask an operator”.  
**Why:** Prevent drift with the shipped API.

## Risks / Trade-offs

- **[Risk] Double POST under React Strict Mode / remounts** → Prefer idempotent handling (`409` ok) and avoid duplicate in-flight posts (single-flight / query mutation guard).  
- **[Risk] Audience misconfigured** → `POST /me` also 401s; same as today for `GET /me`.  
- **[Trade-off] Silent create** → Less conscious consent; accepted because orphan Users are allowed and there is no billed/house gate yet.

## Migration Plan

1. Implement client `POST /me` + silent orchestration in me resolution.
2. Replace AuthPanel operator messaging.
3. Refresh contract docs.
4. Verify: new Logto user → lands as provisioned without operator; existing User → still 200 on first `GET /me`.

## Open Questions

- None that block this change; confirmation-click UX was explicitly declined in favor of silent B.
