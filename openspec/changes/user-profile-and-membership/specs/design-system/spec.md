## MODIFIED Requirements

### Requirement: Color scheme follows the user theme preference
The frontend MUST apply light or dark semantic tokens according to the provisioned user's theme preference: `light` forces the light scheme, `dark` forces the dark scheme, and `system` follows the operating system or browser color scheme (`prefers-color-scheme`). When no provisioned theme is available (unauthenticated or unresolved), the frontend MUST fall back to the system color scheme. Changing theme on Settings MUST update the applied scheme immediately after a successful settings persistence.

#### Scenario: Explicit dark preference
- **WHEN** the provisioned user's theme preference is `dark`
- **THEN** design-system surfaces MUST render using the dark semantic tokens regardless of the system color scheme

#### Scenario: Explicit light preference
- **WHEN** the provisioned user's theme preference is `light`
- **THEN** design-system surfaces MUST render using the light semantic tokens regardless of the system color scheme

#### Scenario: System preference
- **WHEN** the provisioned user's theme preference is `system` and the operating system or browser prefers a dark color scheme
- **THEN** design-system surfaces MUST render using the dark semantic tokens

#### Scenario: Theme change applies immediately
- **WHEN** a provisioned user successfully updates theme from `system` to `light` on Settings
- **THEN** design-system surfaces MUST switch to the light semantic tokens without requiring a full page reload

### Requirement: Minimal reusable UI primitives exist
The frontend MUST provide a small set of reusable UI primitives sufficient for authentication, Home summary, and Settings editing experiences (at minimum: button, alert, card, progress indicator, avatar, separator, text input, label, and switch or equivalent boolean control). New product screens in scope for this change MUST compose those primitives instead of inventing one-off control chrome.

#### Scenario: Shared action control
- **WHEN** a user-facing primary action is rendered on a design-system surface
- **THEN** it MUST use the shared button primitive styled from design tokens

#### Scenario: Settings uses shared form controls
- **WHEN** Settings renders editable full name, theme choice, or notification toggles
- **THEN** those controls MUST use the shared input, label, and switch (or equivalent) primitives styled from design tokens

### Requirement: Authenticated application shell is reusable
When the caller is authenticated at the Identity Provider, the frontend MUST present product content inside a reusable application shell that establishes consistent page chrome (brand presence, primary content region, and account/sign-out affordance). The shell MUST expose navigation entries for Home (`/`) and Settings (`/settings`) and MUST indicate which of those entries is the active route. The shell MUST NOT present navigation links for domain capabilities that are not implemented. Future authenticated routes MUST be able to reuse that shell without duplicating its layout.

#### Scenario: Authenticated content uses the shell
- **WHEN** an authenticated user views an in-scope authenticated page
- **THEN** the page MUST render inside the application shell
- **AND** the shell MUST expose a sign-out action
- **AND** the shell MUST expose Home and Settings navigation entries
- **AND** the shell MUST NOT show fake domain navigation (Houses, tasks, finances, calendar, or similar)

#### Scenario: Home navigation is active on the home route
- **WHEN** an authenticated user is viewing the application home route (`/`) inside the shell
- **THEN** the Home navigation entry MUST be presented as the active route

#### Scenario: Settings navigation is active on the settings route
- **WHEN** an authenticated user is viewing the Settings route (`/settings`) inside the shell
- **THEN** the Settings navigation entry MUST be presented as the active route
