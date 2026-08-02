## MODIFIED Requirements

### Requirement: Domus Users are provisioned explicitly
A Domus User MUST be created only through an explicit authenticated self-serve provisioning operation (`POST /me` or equivalent) that associates the caller's token `sub` with a new Domus User. Login, token issuance, and ordinary authenticated API reads (`GET /me`) MUST NOT provision users. Operator-only internal provisioning MUST NOT be required for first-time Domus access.

#### Scenario: Self-serve provisioning creates a User
- **WHEN** an authenticated caller with no Domus User invokes the self-serve provisioning operation with a valid access token
- **THEN** the system MUST create a Domus User whose `identity_id` equals the token `sub`
- **AND** the system MUST return success with that User's Domus `id` and `identity_id`

#### Scenario: Duplicate identity rejected
- **WHEN** an authenticated caller whose `sub` is already linked to a Domus User invokes the self-serve provisioning operation
- **THEN** the system MUST reject the request without creating a second User for that identity

### Requirement: Frontend authenticates through the Identity Provider
The Domus frontend MUST authenticate end users through the external OIDC Identity Provider using the configured tenant and application, obtain access tokens for the Domus API resource when configured, and use those tokens when calling the Domus API.

#### Scenario: End-user login
- **WHEN** an unauthenticated user initiates login in the frontend
- **THEN** the frontend MUST complete the OIDC authorization code flow with PKCE against the configured Identity Provider
- **AND** the frontend MUST obtain tokens issued by that Identity Provider

#### Scenario: Authenticated API call
- **WHEN** the frontend calls a Domus API operation that requires authentication
- **THEN** the frontend MUST send the Identity Provider access token as a Bearer token

#### Scenario: Silent self-serve provisioning after unprovisioned resolution
- **WHEN** the frontend is authenticated at the Identity Provider, the Domus API base URL is configured, and `GET /me` reports the caller as unprovisioned
- **THEN** the frontend MUST call the self-serve provisioning operation (`POST /me`) with the same access token without requiring operator intervention or a confirmation step
- **AND** the frontend MUST re-resolve the current user afterward
- **AND** on successful provisioning the frontend MUST treat the caller as a provisioned Domus User

#### Scenario: Provisioning failure remains visible
- **WHEN** silent self-serve provisioning fails for a reason other than the user already existing
- **THEN** the frontend MUST present an error state rather than treating the caller as provisioned

## ADDED Requirements

### Requirement: Frontend does not rely on operator provisioning for first access
The frontend MUST NOT instruct end users to ask an operator to create their Domus User as the normal path to first access when the Domus API is configured.

#### Scenario: No operator-gated dead-end
- **WHEN** an authenticated end user reaches Domus User resolution with the API configured
- **THEN** the frontend MUST NOT present operator provisioning as the required next step for becoming a Domus User
