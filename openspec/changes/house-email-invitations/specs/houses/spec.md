## Purpose

Defines how a House grants membership through email-addressed invitations so an admin can bring a specific person into the household without a shareable join code.

## ADDED Requirements

### Requirement: Only a House admin may create invitations
The system MUST allow a provisioned caller to create an invitation only when that caller holds the `admin` role in the target House. Callers who are not members, or who hold a non-admin role, MUST be denied.

#### Scenario: Admin creates an invitation
- **WHEN** a House admin submits a valid invitee email for that House
- **THEN** the system MUST create a pending invitation for that House and email

#### Scenario: Non-admin cannot invite
- **WHEN** a House member who is not an admin attempts to create an invitation for that House
- **THEN** the system MUST deny the request
- **AND** MUST NOT create an invitation

### Requirement: Invitation targets an email and a membership role
An invitation MUST record the invitee email and the membership role that will be granted on accept. When the inviter omits a role, the system MUST use `member`. The system MUST accept only `admin` or `member` as the invitation role. The system MUST NOT copy the invitee email onto the Domus User record.

#### Scenario: Default role is member
- **WHEN** a House admin creates an invitation without specifying a role
- **THEN** the invitation MUST be stored with role `member`

#### Scenario: Admin role may be chosen
- **WHEN** a House admin creates an invitation with role `admin`
- **THEN** the invitation MUST be stored with role `admin`

#### Scenario: Guest role is rejected
- **WHEN** a House admin creates an invitation with role `guest`
- **THEN** the system MUST reject the request as a validation failure
- **AND** MUST NOT create an invitation

### Requirement: At most one pending invitation per House and email
The system MUST allow at most one pending invitation for a given House and invitee email. Email comparison MUST be case-insensitive. The system MUST NOT create a second House membership for a caller who already belongs to that House.

#### Scenario: Duplicate pending invitation is a conflict
- **WHEN** a House admin creates an invitation for an email that already has a pending invitation in that House
- **THEN** the system MUST reject the request as a conflict
- **AND** MUST keep the existing pending invitation

#### Scenario: Already a member cannot accept
- **WHEN** a provisioned caller who is already a member of the invitation's House submits that invitation's token
- **THEN** the system MUST reject the accept as a conflict
- **AND** MUST NOT create a second membership

### Requirement: Invitation email includes a one-time token
When an invitation is created or resent, the system MUST send a transactional email to the invitee address that includes a one-time opaque token both as a link to the frontend invite route and as a pasteable code. The system MUST persist only a hash of the token. Creating the invitation MUST succeed even if email delivery later fails; the invitation MUST remain pending so the admin can resend.

#### Scenario: Email contains link and code
- **WHEN** a House admin successfully creates an invitation
- **THEN** the invitee MUST receive an email that contains a link to `/start/invite` with the token
- **AND** MUST receive the same token as a pasteable code

#### Scenario: Delivery failure leaves invitation pending
- **WHEN** invitation email delivery fails after the invitation has been persisted
- **THEN** the invitation MUST remain pending
- **AND** the admin MUST be able to resend it

### Requirement: Invitation expires and is single-use
A pending invitation MUST expire after seven days from creation or last resend. Accepting a pending unexpired invitation MUST consume it so it cannot be accepted again. A revoked or expired invitation MUST NOT grant membership.

#### Scenario: Expired invitation cannot be accepted
- **WHEN** a provisioned caller whose Identity Provider email matches a pending invitation attempts to accept after the invitation has expired
- **THEN** the system MUST deny the accept
- **AND** MUST NOT create a House membership

#### Scenario: Token cannot be reused after accept
- **WHEN** a pending invitation has already been accepted
- **THEN** a subsequent accept with the same token MUST be denied
- **AND** MUST NOT create a second membership

### Requirement: Admin can list, revoke, and resend pending invitations
A House admin MUST be able to list pending invitations for that House, revoke a pending invitation, and resend a pending invitation. Resend MUST rotate the token, reset expiry to seven days from the resend, and send a new email. Revoke MUST prevent later accept of that invitation. Non-admins MUST be denied these operations.

#### Scenario: Admin lists pending invitations
- **WHEN** a House admin lists invitations for that House
- **THEN** the system MUST return the pending invitations for that House including invitee email and role
- **AND** MUST NOT return invitations for other Houses

#### Scenario: Admin revokes a pending invitation
- **WHEN** a House admin revokes a pending invitation
- **THEN** a later accept with that invitation's token MUST be denied

#### Scenario: Admin resends a pending invitation
- **WHEN** a House admin resends a pending invitation
- **THEN** the previous token MUST no longer be accepted
- **AND** a new email MUST be sent with a new token

### Requirement: Public preview reveals House name without invitee email
Given a valid pending unexpired invitation token, an unauthenticated caller MUST be able to preview the House name. The preview MUST NOT expose the invitee email. An invalid, revoked, expired, or already-accepted token MUST be treated as not found without distinguishing those reasons.

#### Scenario: Valid token previews the House
- **WHEN** an unauthenticated caller previews a valid pending unexpired invitation token
- **THEN** the system MUST return the House name
- **AND** MUST NOT return the invitee email

#### Scenario: Invalid token is not found
- **WHEN** an unauthenticated caller previews a token that is unknown, revoked, expired, or already accepted
- **THEN** the system MUST respond as not found

### Requirement: Accept requires matching Identity Provider email
A provisioned caller MUST accept an invitation by presenting the invitation token. The system MUST grant membership only when the invitation is pending and unexpired, the caller is not already a member of that House, and the caller's Identity Provider email matches the invitation email (case-insensitive). On success the system MUST create a House membership with the invitation's role, mark the invitation accepted, and MUST NOT create a Domus User as a side effect of accept. An unprovisioned caller MUST be denied accept. A mismatching Identity Provider email MUST be denied as forbidden without revealing whether the token is valid for a different email. A caller who is already a member of that House MUST be rejected as a conflict.

#### Scenario: Matching email accepts and joins the House
- **WHEN** a provisioned caller whose Identity Provider email matches a pending unexpired invitation submits that invitation's token
- **THEN** the system MUST create a House membership for that caller in the invitation's House with the invitation's role
- **AND** MUST mark the invitation accepted

#### Scenario: Mismatched email is forbidden
- **WHEN** a provisioned caller whose Identity Provider email does not match the invitation email submits a pending invitation token
- **THEN** the system MUST deny the request as forbidden
- **AND** MUST NOT create a House membership
- **AND** MUST NOT disclose that the token belongs to a different email

#### Scenario: Unprovisioned caller cannot accept
- **WHEN** an authenticated but unprovisioned caller submits a valid invitation token
- **THEN** the system MUST deny the request as not provisioned
- **AND** MUST NOT create a House membership

### Requirement: Frontend invite route accepts a token from link or pasted code
The frontend invite route (`/start/invite`) MUST accept a token from the URL query and from a pasted code. When the caller is unauthenticated, the frontend MUST send them through Identity Provider login or registration and return them to `/start/invite` with the token preserved. After the caller is provisioned, the frontend MUST submit accept for that token and, on success, treat the caller as a member of the invited House.

#### Scenario: Deep link preserves token through login
- **WHEN** an unauthenticated visitor opens `/start/invite` with a token query parameter
- **THEN** the frontend MUST complete Identity Provider authentication
- **AND** MUST return the visitor to `/start/invite` with that token
- **AND** MUST submit accept after the caller is provisioned

#### Scenario: Pasted code is accepted
- **WHEN** a provisioned user pastes a valid invitation token on `/start/invite` and confirms
- **THEN** the frontend MUST submit accept with that token
- **AND** on success MUST treat the user as a member of the invited House

### Requirement: House admin can invite from the selected House
The frontend MUST provide a House-scoped surface for a House admin to create an invitation by email (role `member` by default, `admin` optional), and to list, revoke, and resend that House's pending invitations. The surface MUST NOT be offered to non-admin members of the selected House.

#### Scenario: Admin sends an invitation from the House
- **WHEN** a House admin submits an invitee email from the selected House invite surface
- **THEN** the frontend MUST request creation of an invitation for that House and email
- **AND** MUST show the new pending invitation on that surface

#### Scenario: Non-admin does not see invite management
- **WHEN** a non-admin member views the selected House
- **THEN** the frontend MUST NOT present create, revoke, or resend invitation actions

### Requirement: Creating a House from start offers an invite step
After a provisioned caller creates a House from the create-House flow, the frontend MUST show an invite step on `/start/ready` so they can add member emails and send invitations, or continue without inviting. Visiting `/dashboard` MUST NOT redirect to this step. Skipping House creation MUST NOT show this step.

#### Scenario: Create House continues to the invite step
- **WHEN** a provisioned user successfully creates a House from `/houses/new`
- **THEN** the frontend MUST navigate to `/start/ready`

#### Scenario: Dashboard does not present the post-create invite step
- **WHEN** a member opens `/dashboard`
- **THEN** the frontend MUST NOT navigate to `/start/ready`

#### Scenario: Skip create does not show the invite step
- **WHEN** a user defers House creation
- **THEN** the frontend MUST NOT show `/start/ready`
