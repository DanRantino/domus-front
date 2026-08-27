## MODIFIED Requirements

### Requirement: Authentication does not create a Domus User
A successful authentication at the Identity Provider MUST NOT by itself create a Domus User or grant Domus product access.

#### Scenario: Authenticated identity without Domus User
- **WHEN** a caller is authenticated at the Identity Provider (cookie session or Bearer access token) and no Domus User exists for that `sub`
- **THEN** the system MUST NOT create a Domus User as a side effect of that request
- **AND** the system MUST deny Domus User resolution for that caller

### Requirement: Authenticated identity resolves to at most one Domus User
Given an authenticated Identity Provider identity, the system MUST resolve the caller by looking up a Domus User whose `identity_id` matches the identity `sub`. Resolution MUST yield at most one User.

#### Scenario: Successful resolution
- **WHEN** a caller is authenticated and a Domus User exists for that `sub`
- **THEN** the system MUST resolve that Domus User as the authenticated Domus caller

#### Scenario: No matching User
- **WHEN** a caller is authenticated at the Identity Provider and no Domus User exists for that `sub`
- **THEN** the system MUST treat the caller as authenticated at the IdP but not provisioned in Domus

### Requirement: Current-user endpoint exposes resolution outcomes
The system MUST expose a current-user operation (`GET /me` or equivalent) that returns the resolved Domus User when provisioned, and that distinguishes unauthenticated, unprovisioned, and provisioned outcomes.

#### Scenario: Provisioned caller
- **WHEN** a provisioned Domus User calls the current-user operation while authenticated
- **THEN** the system MUST return success with that User's Domus `id` and `identity_id`

#### Scenario: Valid identity without Domus User
- **WHEN** a caller authenticated at the Identity Provider but with no Domus User calls the current-user operation
- **THEN** the system MUST respond with an authorization failure (HTTP 403 or equivalent typed denial), not an authentication failure

#### Scenario: Missing or invalid authentication
- **WHEN** a caller invokes the current-user operation without a valid cookie session or Bearer access token
- **THEN** the system MUST respond with an authentication failure (HTTP 401 or equivalent)
- **AND** MUST NOT redirect the caller to the Identity Provider

### Requirement: Frontend authenticates through the Identity Provider
The Domus frontend MUST authenticate end users through the ASP.NET authentication backend, which completes the OIDC authorization code flow with the configured Identity Provider traditional-web application. The frontend MUST NOT obtain Identity Provider tokens. Authenticated API calls from the web client MUST rely on the HttpOnly session cookie issued by that backend.

#### Scenario: End-user login
- **WHEN** an unauthenticated user initiates login in the frontend
- **THEN** the frontend MUST navigate (top-level) to the backend login challenge
- **AND** the backend MUST complete the Identity Provider authorization code flow
- **AND** the frontend MUST NOT receive or store access, ID, or refresh tokens

#### Scenario: Authenticated API call
- **WHEN** the frontend calls a Domus API operation that requires authentication
- **THEN** the browser MUST send the backend session cookie
- **AND** the frontend MUST NOT send an Identity Provider access token as a Bearer token

#### Scenario: Unprovisioned user experience
- **WHEN** the frontend is authenticated at the Identity Provider and the current-user operation reports the caller as unprovisioned
- **THEN** the frontend MUST present a clear no-access / not-provisioned state rather than treating the user as a normal Domus User

### Requirement: Frontend does not persist Identity Provider tokens in localStorage
The frontend MUST NOT store Identity Provider access, ID, or refresh tokens in `localStorage` or `sessionStorage`.

#### Scenario: Login does not write tokens to browser storage
- **WHEN** the frontend completes login at the Identity Provider via the backend
- **THEN** the frontend MUST NOT persist access, ID, or refresh tokens in `localStorage` or `sessionStorage`

#### Scenario: Leftover localStorage tokens are discarded
- **WHEN** the frontend starts with Identity Provider tokens already present in `localStorage` or `sessionStorage`
- **THEN** the frontend MUST remove those Logto keys from browser storage

### Requirement: Dashboard is a private frontend route
The frontend MUST keep `/` as a public landing surface. The `/dashboard` route MUST require an Identity Provider session established by the backend cookie. Unauthenticated access MUST initiate the backend login challenge. Authenticated access MAY present a placeholder until product dashboard content exists.

#### Scenario: Unauthenticated dashboard visit
- **WHEN** an unauthenticated user opens `/dashboard`
- **THEN** the frontend MUST start a top-level navigation to the backend login challenge

#### Scenario: Authenticated dashboard visit
- **WHEN** an authenticated user opens `/dashboard`
- **THEN** the frontend MUST render the dashboard surface
- **AND** that surface MAY be a placeholder greeting until product content exists

#### Scenario: Public home remains reachable
- **WHEN** a user opens `/` without an Identity Provider session
- **THEN** the frontend MUST render the public landing without requiring login

#### Scenario: Authenticated visitor on public home
- **WHEN** a user with an Identity Provider session opens `/`
- **THEN** the frontend MUST still render the public landing
- **AND** MUST NOT switch `/` to the authenticated dashboard shell
- **AND** MUST show an avatar in the header representing the IdP identity (`picture` claim when present, otherwise a fallback)
- **AND** MUST NOT show the login action while that session is present
- **AND** the avatar MUST link to `/dashboard`

## ADDED Requirements

### Requirement: Backend session exposes Identity Provider identity to the frontend
The system MUST expose a session operation that reports whether the caller has an Identity Provider cookie session and, when authenticated, the IdP profile claims needed for the public Home avatar (`picture`, `name`). The operation MUST succeed without a Domus User.

#### Scenario: Guest session
- **WHEN** a caller with no backend session cookie requests the session operation
- **THEN** the system MUST return success indicating the caller is not authenticated

#### Scenario: Authenticated session without Domus User
- **WHEN** a caller with a valid Identity Provider cookie session and no Domus User requests the session operation
- **THEN** the system MUST return success indicating the caller is authenticated
- **AND** MUST include IdP profile claims when present (`picture`, `name`)

### Requirement: API accepts cookie session or Bearer access token
Protected API operations MUST accept either the backend Identity Provider cookie session (web) or a Bearer access token for the Domus API resource (non-browser clients). The caller's `sub` MUST be taken from the authenticated identity in either case.

#### Scenario: Cookie-authenticated web caller
- **WHEN** a web caller sends the backend session cookie and no Bearer token
- **THEN** the system MUST authenticate the caller from that cookie

#### Scenario: Bearer-authenticated caller
- **WHEN** a caller sends a valid Bearer access token for the Domus API resource
- **THEN** the system MUST authenticate the caller from that token
