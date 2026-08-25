## Why

The frontend needs a clean SPA baseline on the intended stack (React + Vite + TypeScript, React Router, Redux Toolkit / RTK Query, MUI, React Hook Form, i18n, Zod, Vitest, Storybook). The previous TanStack Start / shadcn app and later product screens are out of scope for this reset.

## What Changes

- Rebuild the frontend as a Vite SPA with the requested toolchain.
- Ship a single Home route (`/`).
- Leave identity, Settings, API clients, and other product surfaces out of this change.

## Capabilities

### New Capabilities

- (none)

### Modified Capabilities

- `design-system`: Token delivery moves to an MUI theme. Home is the only in-scope surface.

## Impact

- Frontend: new Vite bootstrap, routing, store, theme, i18n, Storybook, and a Home page.
- Unaffected: Domus API, Logto, House capabilities, Settings, provisioning UX.
