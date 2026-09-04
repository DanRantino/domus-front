## ADDED Requirements

### Requirement: Frontend bootstraps the current user from GraphQL me
The frontend MUST resolve a provisioned Domus User for authenticated product surfaces by invoking the GraphQL current-user query (`me`) over the authenticated GraphQL operation. The frontend MUST NOT use `GET /users/me` or `GET /houses` as the bootstrap read for profile, display name, or the caller's house membership list used by shell and household-gate surfaces. REST `GET /users/me` and `GET /houses` MAY still be used for other operations.

#### Scenario: Provisioned bootstrap
- **WHEN** an authenticated provisioned caller opens an authenticated product surface that needs current-user data
- **THEN** the frontend MUST request GraphQL `me`
- **AND** MUST obtain `id`, `name`, `profile`, and `houses` from the success payload
- **AND** MUST use `houses` as the caller's membership list for shell and household-gate surfaces

#### Scenario: Unprovisioned GraphQL me triggers self-serve provisioning
- **WHEN** the frontend is authenticated and GraphQL `me` reports the caller as unprovisioned (`not_provisioned`)
- **THEN** the frontend MUST call REST `POST /users/me` without requiring a confirmation step
- **AND** the frontend MUST re-invoke GraphQL `me` afterward
- **AND** on successful provisioning the frontend MUST treat the caller as a provisioned Domus User

## MODIFIED Requirements

### Requirement: Current-user endpoint exposes resolution outcomes
The system MUST expose a current-user read operation. For the SPA, that operation is the GraphQL query `me` (equivalent to `GET /me`). The operation MUST return the resolved Domus User when provisioned, and MUST distinguish unauthenticated, unprovisioned, and provisioned outcomes. GraphQL `me` MUST NOT create a Domus User. REST `GET /users/me` and `POST /users/me` remain valid; `POST /users/me` remains the explicit self-serve provisioning operation.

When provisioned, GraphQL `me` MUST return:
- Domus `id`
- `name` (null when `full_name` is unset or empty)
- `profile` with `theme` and notification booleans (`notifyDailyTasks`, `notifyExpenses`, `notifyFamilyChat`)
- `houses` as an array of the caller's memberships, each with House `id`, `name`, and membership `role` (empty when the user has none)

Unauthenticated callers MUST receive an authentication failure (HTTP 401 or equivalent). Authenticated callers without a Domus User MUST receive a typed unprovisioned denial (`not_provisioned`), not an authentication failure.

#### Scenario: Provisioned caller
- **WHEN** a provisioned Domus User invokes GraphQL `me` with a valid authenticated session
- **THEN** the system MUST return success
- **AND** MUST include `id`, `name`, `profile`, and `houses` in the success payload

#### Scenario: Provisioned caller with no houses
- **WHEN** a provisioned Domus User with no House memberships invokes GraphQL `me`
- **THEN** the system MUST return `houses` as an empty array

#### Scenario: Valid token without Domus User
- **WHEN** a caller with a valid authenticated session but no Domus User invokes GraphQL `me`
- **THEN** the system MUST respond with a typed unprovisioned denial (`not_provisioned`)
- **AND** MUST NOT create a Domus User
- **AND** MUST NOT treat the outcome as an authentication failure

#### Scenario: Missing or invalid token
- **WHEN** a caller invokes GraphQL `me` without a valid authenticated session
- **THEN** the system MUST respond with an authentication failure (HTTP 401 or equivalent)
