## ADDED Requirements

### Requirement: Unauthenticated welcome uses the design system
When the frontend has no Identity Provider session, it MUST present an intentional unauthenticated welcome surface built from the design system. The surface MUST identify the Domus brand at a hero-level signal, offer a clear path to sign in through the Identity Provider, and MUST NOT introduce domain capabilities (Houses, tasks, finances, or similar).

#### Scenario: Welcome before sign-in
- **WHEN** an unauthenticated user opens the app entry surface
- **THEN** the frontend MUST show a design-system welcome that presents Domus branding, a short supporting message, and a sign-in action
- **AND** initiating sign-in MUST still complete the existing OIDC authorization code flow with PKCE

### Requirement: Bootstrap and loading states are intentional
While the frontend is resolving the Identity Provider session or the Domus User via the current-user operation, it MUST show an intentional bootstrap/loading presentation rather than an empty or broken layout.

#### Scenario: Session check in progress
- **WHEN** the Identity Provider session status is still loading
- **THEN** the frontend MUST show a design-system loading/bootstrap state that indicates progress

#### Scenario: Domus User resolution in progress
- **WHEN** the user is authenticated at the Identity Provider and the current-user operation is in progress
- **THEN** the frontend MUST show a design-system loading/bootstrap state for Domus User setup

### Requirement: Failure and no-access states are intentional
When Logto is misconfigured, sign-in fails, the Domus API is unavailable or rejects the caller, or Domus User resolution fails after authentication, the frontend MUST present an intentional failure or no-access surface using the design system. These surfaces MUST NOT invent House or other domain workflows.

#### Scenario: Missing Identity Provider configuration
- **WHEN** Logto is not configured
- **THEN** the frontend MUST show a design-system configuration guidance surface instead of a broken sign-in control

#### Scenario: Authentication or resolution failure
- **WHEN** sign-in fails or Domus User resolution fails after Identity Provider authentication
- **THEN** the frontend MUST show a design-system failure surface with a clear recovery action where applicable (for example retry or sign out)

### Requirement: Provisioned user appears in the authenticated shell
When Domus User resolution succeeds, the frontend MUST present a lightweight authenticated profile surface inside the application shell using data returned by the current-user operation. The surface MUST NOT fabricate profile fields, household roles, settings toggles, or domain navigation that the product does not yet support.

#### Scenario: Provisioned profile in shell
- **WHEN** a provisioned Domus User is resolved via the current-user operation
- **THEN** the frontend MUST render that user inside the authenticated application shell
- **AND** the surface MUST expose at least the Domus User identity information already available from resolution
- **AND** the shell MUST provide sign-out without changing authentication or API contracts
