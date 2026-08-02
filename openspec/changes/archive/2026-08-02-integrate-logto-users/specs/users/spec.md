## Purpose

Defines the Domus User as the domain identity linked to an external OIDC subject, and the rules for authenticating, provisioning, and resolving that user without granting automatic product access on login.

## ADDED Requirements

### Requirement: Domus User is linked to an external identity
The system MUST represent a Domus User with a Domus-owned identifier and a stable `identity_id` that equals the OIDC subject (`sub`) from the Identity Provider. Domus MUST NOT store user credentials.

#### Scenario: User identity linkage
- **WHEN** a Domus User exists for an authenticated OIDC subject
- **THEN** that User's `identity_id` MUST equal the token `sub`

### Requirement: Authentication does not create a Domus User
A successful authentication at the Identity Provider MUST NOT by itself create a Domus User or grant Domus product access.

#### Scenario: Authenticated identity without Domus User
- **WHEN** a caller presents a valid access token whose `sub` has no corresponding Domus User
- **THEN** the system MUST NOT create a Domus User as a side effect of that request
- **AND** the system MUST deny Domus User resolution for that caller

### Requirement: Domus Users are provisioned explicitly
A Domus User MUST be created only through an explicit internal provisioning operation that associates an `identity_id` with a new Domus User. Login, token issuance, and ordinary authenticated API reads MUST NOT provision users.

#### Scenario: Internal provisioning creates a User
- **WHEN** an authorized internal provisioning request supplies an `identity_id` that is not yet linked to a Domus User
- **THEN** the system MUST create a Domus User with that `identity_id`

#### Scenario: Duplicate identity rejected
- **WHEN** an internal provisioning request supplies an `identity_id` already linked to a Domus User
- **THEN** the system MUST reject the request without creating a second User for that identity

### Requirement: Authenticated identity resolves to at most one Domus User
Given a valid access token, the system MUST resolve the caller by looking up a Domus User whose `identity_id` matches the token `sub`. Resolution MUST yield at most one User.

#### Scenario: Successful resolution
- **WHEN** a caller presents a valid access token and a Domus User exists for that `sub`
- **THEN** the system MUST resolve that Domus User as the authenticated Domus caller

#### Scenario: No matching User
- **WHEN** a caller presents a valid access token and no Domus User exists for that `sub`
- **THEN** the system MUST treat the caller as authenticated at the IdP but not provisioned in Domus

### Requirement: Current-user endpoint exposes resolution outcomes
The system MUST expose a current-user operation (`GET /me` or equivalent) that returns the resolved Domus User when provisioned, and that distinguishes unauthenticated, unprovisioned, and provisioned outcomes.

#### Scenario: Provisioned caller
- **WHEN** a provisioned Domus User calls the current-user operation with a valid access token
- **THEN** the system MUST return success with that User's Domus `id` and `identity_id`

#### Scenario: Valid token without Domus User
- **WHEN** a caller with a valid access token but no Domus User calls the current-user operation
- **THEN** the system MUST respond with an authorization failure (HTTP 403 or equivalent typed denial), not an authentication failure

#### Scenario: Missing or invalid token
- **WHEN** a caller invokes the current-user operation without a valid access token
- **THEN** the system MUST respond with an authentication failure (HTTP 401 or equivalent)

### Requirement: Frontend authenticates through the Identity Provider
The Domus frontend MUST authenticate end users through the external OIDC Identity Provider using the configured tenant and application, obtain access tokens for the Domus API resource when configured, and use those tokens when calling the Domus API.

#### Scenario: End-user login
- **WHEN** an unauthenticated user initiates login in the frontend
- **THEN** the frontend MUST complete the OIDC authorization code flow with PKCE against the configured Identity Provider
- **AND** the frontend MUST obtain tokens issued by that Identity Provider

#### Scenario: Authenticated API call
- **WHEN** the frontend calls a Domus API operation that requires authentication
- **THEN** the frontend MUST send the Identity Provider access token as a Bearer token

#### Scenario: Unprovisioned user experience
- **WHEN** the frontend is authenticated at the Identity Provider and the current-user operation reports the caller as unprovisioned
- **THEN** the frontend MUST present a clear no-access / not-provisioned state rather than treating the user as a normal Domus User
