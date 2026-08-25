# design-system Specification

## Purpose

Establishes the Domus frontend visual foundation: shared design tokens, typography, a minimal set of reusable UI primitives, and an authenticated application shell that future capabilities can reuse without inventing parallel styles.

## Requirements

### Requirement: Design tokens are the single source of visual truth
The frontend MUST expose a centralized set of design tokens for the approved palette, typography, spacing, and surface treatments. Product UI that participates in the design system MUST consume those tokens rather than hard-coding the approved brand values inline. Palette keys MUST exist for brand anchors; semantic tokens MUST map from those keys per color scheme.

#### Scenario: Tokenized brand colors in light scheme
- **WHEN** a design-system surface renders brand colors and the system color scheme is light
- **THEN** primary actions MUST resolve to `#4A6741`, warm surface to `#EFEBE3`, tertiary accent to `#815166`, and neutral text/chrome to `#2D2D2D` via the shared tokens

#### Scenario: Tokenized brand colors in dark scheme
- **WHEN** a design-system surface renders brand colors and the system color scheme is dark
- **THEN** surfaces MUST use Neutral `#2D2D2D` and text MUST use Secondary `#EFEBE3` via the dark semantic token set
- **AND** primary actions MUST still resolve to `#4A6741`
- **AND** product UI MUST still consume only semantic tokens (not hard-coded hex)

#### Scenario: Tokenized typography
- **WHEN** a design-system surface renders heading or body text
- **THEN** headings MUST use Source Serif 4 and UI/body text MUST use Hanken Grotesk via the shared tokens

### Requirement: Color scheme follows the system setting
The frontend MUST apply light or dark semantic tokens according to the user's system color scheme (`prefers-color-scheme`). This delivery MUST NOT require a manual theme toggle or persisted theme preference.

#### Scenario: System dark preference
- **WHEN** the operating system or browser prefers a dark color scheme
- **THEN** design-system surfaces MUST render using the dark semantic tokens

#### Scenario: System light preference
- **WHEN** the operating system or browser prefers a light color scheme
- **THEN** design-system surfaces MUST render using the light semantic tokens

### Requirement: Minimal reusable UI primitives exist
The frontend MUST provide a small set of reusable UI primitives sufficient for the current authentication and authenticated-user experience (at minimum: button, alert, card, progress indicator, avatar, and separator). New product screens in scope for this change MUST compose those primitives instead of inventing one-off control chrome.

#### Scenario: Shared action control
- **WHEN** a user-facing primary action is rendered on a design-system surface
- **THEN** it MUST use the shared button primitive styled from design tokens

### Requirement: Authenticated application shell is reusable
When the caller is authenticated at the Identity Provider, the frontend MUST present product content inside a reusable application shell that establishes consistent page chrome (brand presence, primary content region, and account/sign-out affordance). The shell MUST expose a Home navigation entry to the application home route (`/`) and MUST indicate when that entry is the active route. The shell MUST NOT present navigation links for domain capabilities that are not implemented. Future authenticated routes MUST be able to reuse that shell without duplicating its layout.

#### Scenario: Authenticated content uses the shell
- **WHEN** an authenticated user views an in-scope authenticated page
- **THEN** the page MUST render inside the application shell
- **AND** the shell MUST expose a sign-out action
- **AND** the shell MUST expose a Home navigation entry to `/`
- **AND** the shell MUST NOT show fake domain navigation (Houses, tasks, finances, calendar, or similar)

#### Scenario: Home navigation is active on the home route
- **WHEN** an authenticated user is viewing the application home route (`/`) inside the shell
- **THEN** the Home navigation entry MUST be presented as the active route

### Requirement: Presentation remains usable on desktop and mobile
Design-system surfaces in scope MUST remain usable on both desktop and mobile viewports: content MUST remain readable, primary actions MUST remain reachable, and layout MUST not require horizontal scrolling for the default auth and shell experiences at common mobile widths.

#### Scenario: Mobile welcome and shell
- **WHEN** a user opens the unauthenticated welcome surface or the authenticated shell on a mobile-width viewport
- **THEN** brand, primary message, and primary actions MUST remain visible and operable without horizontal scrolling
