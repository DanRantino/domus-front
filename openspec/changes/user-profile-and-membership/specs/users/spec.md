## ADDED Requirements

### Requirement: Frontend consumes the expanded current-user representation
When the current-user operation succeeds for a provisioned caller, the frontend MUST treat the user as having `id`, `identity_id`, `full_name` (nullable), `settings` with `theme` (`light`, `dark`, or `system`) and `notifications` booleans (`daily_tasks`, `expenses`, `family_chat`), and `houses` as an array of membership summaries each containing House `id`, `name`, and membership `role`. The frontend MUST NOT invent missing profile fields beyond that representation.

#### Scenario: Provisioned payload shapes Home and Settings
- **WHEN** the frontend resolves a provisioned Domus User from the current-user operation
- **THEN** it MUST make `full_name`, `settings`, and `houses` available to authenticated Home and Settings surfaces
- **AND** it MUST treat a missing or null `full_name` as unset rather than fabricating a display name from credentials

### Requirement: Home presents a read-only profile and membership summary
For a provisioned caller on the application home route (`/`), the frontend MUST present a read-only summary that includes the caller's `full_name` state (set or unset) and the caller's House memberships from `houses`. Home MUST NOT expose editors for `full_name`, theme, or notification preferences.

#### Scenario: Home shows name and memberships
- **WHEN** a provisioned user views Home with a non-empty `full_name` and one or more memberships
- **THEN** the frontend MUST show that name and each membership's House name and role
- **AND** MUST NOT present Settings controls for theme or notifications on Home

#### Scenario: Home with unset name and no houses
- **WHEN** a provisioned user views Home with null `full_name` and an empty `houses` array
- **THEN** the frontend MUST present an unset-name state and an empty-memberships state without fabricating houses

### Requirement: Settings updates optional full name
A provisioned caller MUST be able to set, change, or clear `full_name` from the Settings surface. The frontend MUST persist changes through the profile update operation (`PATCH /me`). Clearing the field MUST send a clear signal (`null` or empty) so the API stores null. On success, the frontend MUST refresh its current-user representation from the response or an equivalent re-read.

#### Scenario: Set full name from Settings
- **WHEN** a provisioned user submits a non-empty `full_name` on Settings
- **THEN** the frontend MUST call `PATCH /me` with that name
- **AND** MUST update the displayed current-user state from the successful result

#### Scenario: Clear full name from Settings
- **WHEN** a provisioned user clears `full_name` on Settings
- **THEN** the frontend MUST call `PATCH /me` in a way that clears the stored name
- **AND** MUST present the name as unset after success

### Requirement: Settings updates theme and notification preferences with persistence
A provisioned caller MUST update `theme` and per-category notification preferences from Settings. The frontend MUST persist changes through `PATCH /me/settings` and MUST NOT keep preference toggles as local-only mock state. Omitted categories on a partial notifications update MUST leave those categories unchanged on the server per API semantics. After a successful settings update, the frontend MUST refresh its current-user representation from the response or an equivalent re-read.

#### Scenario: Change theme from Settings
- **WHEN** a provisioned user selects theme `dark` on Settings
- **THEN** the frontend MUST call `PATCH /me/settings` with `theme` equal to `dark`
- **AND** MUST apply the dark color scheme in the UI without requiring a full page reload

#### Scenario: Toggle a notification category
- **WHEN** a provisioned user turns `notifications.expenses` off on Settings
- **THEN** the frontend MUST call `PATCH /me/settings` reflecting that change
- **AND** MUST NOT require the user to also resubmit unchanged notification categories for the update to succeed

#### Scenario: Invalid theme is not applied
- **WHEN** the settings update operation rejects a theme value with a validation failure
- **THEN** the frontend MUST keep the previous applied theme
- **AND** MUST present a failure state rather than pretending the invalid theme was saved

### Requirement: Password change uses the Identity Provider Account API from Settings
The frontend MUST NOT collect or submit password material to Domus. When Settings offers password change, the frontend MUST submit the new password to the configured Identity Provider Account API endpoint (`VITE_LOGTO_PASSWORD_URL`) using a Bearer OP access token, after verifying the current password with the IdP verification API. The user MUST remain on the Settings surface (no Domus password storage or Domus `/password` endpoint).

#### Scenario: Change password from Settings form
- **WHEN** a provisioned user submits current password, new password, and confirmation on Settings
- **THEN** the frontend MUST verify the current password with the Identity Provider
- **AND** MUST POST the new password to the configured IdP Account API password endpoint with a verification id
- **AND** MUST NOT call a Domus API that accepts password credentials
- **AND** MUST present success or failure feedback on Settings

## MODIFIED Requirements

### Requirement: Current-user endpoint exposes resolution outcomes
The system MUST expose a current-user read operation (`GET /me`) that returns the resolved Domus User when provisioned, and that distinguishes unauthenticated, unprovisioned, and provisioned outcomes. When provisioned, the frontend MUST consume a success payload whose user data contains `id`, `identity_id`, `full_name` (null when unset), `settings` with `theme` and `notifications` (`daily_tasks`, `expenses`, `family_chat` booleans), and `houses` as an array of the caller's memberships (`id`, `name`, `role`), empty when the user has none. When the caller is authenticated but not provisioned, the frontend MUST treat the outcome as not provisioned (HTTP 403 / `not_provisioned` semantics), not as an ordinary provisioned session.

#### Scenario: Provisioned caller
- **WHEN** a provisioned Domus User calls `GET /me` with a valid access token
- **THEN** the frontend MUST treat the call as success
- **AND** MUST obtain `id`, `identity_id`, `full_name`, `settings`, and `houses` from the success payload

#### Scenario: Provisioned caller with no houses
- **WHEN** a provisioned Domus User with no House memberships calls `GET /me`
- **THEN** the frontend MUST treat `houses` as an empty array

#### Scenario: Valid token without Domus User
- **WHEN** a caller with a valid access token but no Domus User calls `GET /me`
- **THEN** the frontend MUST treat the outcome as not provisioned
- **AND** MUST NOT treat the caller as a normal Domus User

#### Scenario: Missing or invalid token
- **WHEN** a caller invokes `GET /me` without a valid access token
- **THEN** the frontend MUST treat the outcome as unauthenticated
