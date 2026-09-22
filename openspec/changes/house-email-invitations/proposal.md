## Why

A House is a shared household, but today the only way to become a member is to create the House. Admins cannot bring partners or family in, and `/start/invite` is a placeholder. Email-addressed invitations close that gap without turning membership into an open join code.

## What Changes

- Admins of a House can invite a person by email, optionally choosing role `admin` or defaulting to `member`.
- Domus sends a transactional invitation email (Resend) containing a one-time opaque token as a link and as a pasteable code on `/start/invite`.
- The invitee authenticates at the Identity Provider, is provisioned as a Domus User if needed, and accepts only when the IdP email matches the invited email.
- Accepting creates a `HouseMembership`; the invitation is a distinct pending record until then.
- Admins can list, revoke, and resend pending invitations for their House.
- Public preview of a valid token shows the House name without exposing the invited email.
- Replace the invite placeholder UX with accept (deep link + code) and a House-scoped admin invite surface.
- After creating a House from `/houses/new`, show a one-shot invite step on `/start/ready`; visiting `/dashboard` must not present that step.

## Capabilities

### New Capabilities

- `houses`: House membership granted through email-addressed invitations (create, list, revoke, resend, preview, accept), including who may invite and how membership is created on accept.

### Modified Capabilities

- (none)

## Impact

- Domus API: House invitation persistence and endpoints under `/houses/{id}/invitations` plus `/invitations/preview` and `/invitations/accept`; Resend HTTP adapter; IdP email on accept (`email` claim or userinfo).
- Frontend: `/start/invite` accept flow (query token, pasteable code, OIDC return URL); `/start/ready` after House create; admin invite UI on the selected House; i18n copy that treats the email token as the access code.
- Identity: Logto login/registration for invitees; no Domus-owned credentials; email is not copied onto `User`.
- Unaffected: shareable household join codes; role `guest`; notification delivery beyond this transactional invite email; Logto Management pre-provisioning of invitees.
