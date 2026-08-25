## MODIFIED Requirements

### Requirement: Design tokens are the single source of visual truth
The frontend MUST expose a centralized set of design tokens through the shared MUI theme. Product UI that participates in the design system MUST consume those tokens rather than hard-coding the approved brand values inline.

#### Scenario: Tokenized brand colors in light scheme
- **WHEN** Home renders brand colors and the active color scheme is light
- **THEN** primary MUST resolve to `#4A6741`, warm surface to `#EFEBE3`, tertiary accent to `#815166`, and neutral text to `#2D2D2D` via the shared tokens

#### Scenario: Tokenized typography
- **WHEN** Home renders heading or body text
- **THEN** headings MUST use Source Serif 4 and UI/body text MUST use Hanken Grotesk via the shared tokens

## ADDED Requirements

### Requirement: Product copy is served through i18n catalogs
User-facing product strings on Home MUST come from i18n catalogs. The default language MUST be `pt-BR`.

#### Scenario: Portuguese default copy
- **WHEN** a user opens Home without an explicit language override
- **THEN** visible product copy MUST be resolved from the `pt-BR` catalog
