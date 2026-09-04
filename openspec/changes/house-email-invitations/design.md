## Context

See proposal.md for motivation. Houses already exist: create House makes the caller `admin`, `GET /houses` and `GET /me` list memberships, and `HouseMembership` is keyed by `(UserId, HouseId)`. There is no invitation record, no member-add API, and no email sender. User email lives in Logto; `User` stores `identity_id` and optional `full_name` only. `/start/invite` is a public placeholder. Silent self-serve `POST /me` provisions an authenticated identity without creating House access.

## Goals / Non-Goals

**Goals:**

- Invitation as its own aggregate so the invitee need not exist as a Domus User at send time.
- Transactional Resend delivery behind a narrow Application port, not a notification platform.
- Accept bound to IdP email; token hash at rest; preview that does not leak invitee email.
- Frontend deep link and pasteable code on `/start/invite`, plus House-scoped admin invite UI.

**Non-Goals:**

- Shareable household join codes.
- Role `guest` on invitations.
- Copying email onto `User`.
- Logto Management pre-create of invitees.
- Resend webhooks or delivery tracking.
- Generic notification/email infrastructure.

## Decisions

### D1: Invitation aggregate, not pending membership

**Choice:** Persist `HouseInvitation` (`HouseId`, `InvitedByUserId`, `Email`, `Role`, `TokenHash`, `Status`, `ExpiresAt`, `CreatedAt`, `AcceptedAt`, `AcceptedByUserId`). Create `HouseMembership` only on accept.

**Why:** Membership requires a User; the invitee often has none yet. Pending membership would force a fake or missing `UserId`.

**Alternatives considered:** Status on `HouseMembership` — rejected; email-only join without a record — rejected (no revoke/list).

### D2: Token hash plus one-time plaintext to mailer

**Choice:** Generate a ~21 character URL-safe opaque token. Store SHA-256 (or equivalent) hash. Pass plaintext only to the mailer and to the create/resend API response so the admin is not solely dependent on email. Lookup on preview/accept hashes the presented token.

**Why:** A leaked database must not yield working tokens; the same value is the link query and the pasteable code.

**Alternatives considered:** Short numeric PIN — easier to guess; encrypt token at rest — more moving parts for the same threat model.

### D3: Email-bound accept via IdP, not client-supplied email

**Choice:** On accept, read the caller's email from the access token `email` claim, falling back to IdP userinfo if the claim is absent. Compare case-insensitively to the invitation email. Do not accept an email from the request body. Mismatch returns `forbidden` without distinguishing “wrong person” from “bad token” beyond existing not-found for unknown tokens.

**Why:** Specs require matching IdP email; the client must not assert identity. Domus still does not persist User email.

**Alternatives considered:** Token possession only — rejected (forwarded mail would join as whoever is logged in); Logto Management lookup by `sub` on every accept — heavier than claim/userinfo.

### D4: Persist invitation before sending mail

**Choice:** Write the pending invitation, then call Resend. If Resend fails, keep `pending` and surface a delivery failure so the admin can resend. Cap pending invitations per House (e.g. 20) as a simple abuse limit.

**Why:** Rolling back on mail failure loses the record; sending without a row risks an email with an unusable token.

**Alternatives considered:** Dual-write transaction with mail — Resend is not transactional; outbox table — overkill for one mail type.

### D5: Narrow `IInvitationMailer`, Resend HTTP in Infrastructure

**Choice:** Application defines `IInvitationMailer` (to, house name, inviter display name, token, accept URL). Infrastructure implements with `HttpClient` against Resend. Configuration: API key, from address, frontend public origin for links. Do not introduce a generic `IEmailSender`.

**Why:** Architecture forbids speculative notification buses; this is one transactional use case.

**Alternatives considered:** Official Resend SDK — extra dependency for a single POST; send from the frontend — leaks the API key.

### D6: HTTP shape

**Choice:** Nested admin routes on the House; public/accept routes at `/invitations`:

- `POST /houses/{houseId}/invitations` `{ email, role? }` → 201 (admin)
- `GET /houses/{houseId}/invitations` pending list (admin)
- `DELETE /houses/{houseId}/invitations/{id}` revoke (admin)
- `POST /houses/{houseId}/invitations/{id}/resend` (admin)
- `GET /invitations/preview?token=` AllowAnonymous
- `POST /invitations/accept` `{ token }` authenticated + provisioned

Reuse `AppResult` / `ErrorCodes`. Existing-member and duplicate-pending → `conflict`. Guest role → `validation_error`. Non-admin → `forbidden`. Unprovisioned accept → `not_provisioned`.

**Why:** Matches current controller style; preview must work before login.

**Alternatives considered:** Accept nested under `/houses/{id}` — invitee may not know the House id; magic-link one-shot GET — unsafe (prefetch).

### D7: Existing-member conflict without storing User email

**Choice:** Unique pending invitations on `(HouseId, normalized email)`. Do not search the IdP directory at create time. At accept, if the authenticated caller is already a member of the House, reject as `conflict` and do not create a second membership (leave the invitation pending so it remains usable by the intended invitee).

**Why:** Domus does not store User email, so create-time “this email is already a member” is not enforceable without Logto-specific directory search.

**Alternatives considered:** Logto Management lookup by email on create — couples a domain write to IdP vendor APIs.

### D8: Frontend return URL and House admin surface

**Choice:** `/start/invite` stays public. Token from `?token=` or form field. Unauthenticated users start Logto with return to `/start/invite?token=`. After me-resolution (including silent `POST /me`), call `POST /invitations/accept`. Creating a House from `/houses/new` continues to `/start/ready` (local email list, send or skip, then dashboard). `/dashboard` must not redirect to `/start/ready`. Admin invite UI lives on the selected House (members/invites section), gated by membership role `admin` from `/me` houses.

**Why:** Matches existing start routes and HouseholdGate; the post-create invite is a start-only step, not a dashboard gate.

**Alternatives considered:** Separate `/invites/:token` route — extra routing for the same job; invite from Settings — wrong context (user vs House); gating `/dashboard` on whether invites were sent — would re-show the step on later visits.

## Risks / Trade-offs

- **[Risk] Access token lacks `email`** → Fall back to userinfo; fail accept as forbidden if still missing rather than skipping the match.
- **[Risk] Resend abuse** → Pending cap per House; admin-only create; no public send.
- **[Risk] Token in URL logs** → Short-lived, hashed at rest, single-use; HTTPS only.
- **[Trade-off] Create-time “already a member”** → Not enforceable without storing email or IdP directory search; uniqueness of pending email + accept-time already-member is the v1 invariant.
- **[Trade-off] Invitee must register with the invited email** → Required for email binding; copy should say so.

## Migration Plan

1. Add `house_invitations` table and Application/API endpoints.
2. Configure Resend API key, from address, and public frontend origin (dev can log/no-op mailer if key absent, still persist invitations).
3. Ship frontend accept + admin invite UI.
4. Rollback: stop sending; pending rows unused; memberships already accepted remain.

## Open Questions

- None that block this change. From-address and Resend domain verification are environment setup, not product decisions.
