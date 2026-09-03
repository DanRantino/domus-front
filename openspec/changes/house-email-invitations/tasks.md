## 1. Domain and persistence

- [x] 1.1 Add `HouseInvitation` (status pending/accepted/revoked, email, role, token hash, expiry, inviter, accept metadata) and a unique pending-per-house-email constraint, then verify the EF migration applies
- [x] 1.2 Extend the existing House membership write boundary to add a member on accept (no parallel generic repository) and verify a membership row can be created for an existing User and House

## 2. Application invitations

- [x] 2.1 Add `InvitationService` with token generation (URL-safe opaque, hashed at rest), 7-day expiry, pending cap, admin-only create/list/revoke/resend, and default role `member`; verify unit tests for validation, duplicate pending, guest role rejection, and non-admin denial
- [x] 2.2 Implement accept (pending + unexpired + IdP email match, already-member conflict, consume token) and preview (House name only; unknown/revoked/expired/accepted → not found) and verify unit tests cover match, mismatch, expired, reused token, and unprovisioned denial
- [x] 2.3 Define `IInvitationMailer` and send after persist on create/resend (keep pending if send fails); verify a failing mailer still leaves a pending invitation

## 3. API and Resend

- [x] 3.1 Expose `POST/GET /houses/{id}/invitations`, `DELETE .../{id}`, `POST .../{id}/resend` for admins and verify integration tests for 201, 403 non-admin, 409 duplicate pending, and 400 guest role
- [x] 3.2 Expose anonymous `GET /invitations/preview` and authenticated `POST /invitations/accept`; resolve caller email from token `email` claim or userinfo (never request body) and verify preview hides invitee email and accept matches/mismatches email
- [x] 3.3 Implement Resend HTTP mailer plus config (API key, from, frontend origin); use a no-op/log mailer when the key is absent in Development and verify create still persists

## 4. Frontend accept flow

- [x] 4.1 Replace `/start/invite` placeholder with token from `?token=` or pasted code, public preview, and copy that the code is the email token; verify tests for preview, paste submit, and invalid token
- [x] 4.2 Preserve token through IdP login return URL, accept after silent provision, and on success treat the user as a member of the invited House; verify unauthenticated deep link keeps the token and provisioned accept is called

## 5. Frontend admin invites

- [x] 5.1 Add a House-scoped admin surface to create (email, optional `admin` role), list, revoke, and resend pending invitations, hidden from non-admins; verify admin can invite and non-admin does not see those actions
- [x] 5.2 Cover i18n (`pt-BR` / `en`) for invite and accept copy, including that the invitee must use the invited email; verify catalogs contain the new keys

## 6. Post-create invite step

- [x] 6.1 After creating a House from `/houses/new`, navigate to `/start/ready` with a local email list, send-or-skip, then dashboard; verify create goes to ready and dashboard/skip do not
