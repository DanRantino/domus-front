## Context

Reset the frontend to an empty SPA on the requested stack, with only a Home page.

## Goals / Non-Goals

**Goals:**

- Vite SPA with React + TypeScript.
- React Router with `/`.
- Redux Toolkit store with an empty RTK Query API ready for later endpoints.
- MUI theme from existing Domus palette and typography.
- i18n with `pt-BR` default and `en` fallback.
- Vitest and Storybook wired for Home.
- React Hook Form and Zod available as dependencies for future forms.

**Non-Goals:**

- Authentication / Logto.
- Settings, `/me`, provisioning.
- Extra routes beyond Home.

## Decisions

### D1: Empty product surface

**Choice:** Home only. No session gate, shell navigation, or API calls.

**Why:** The requested starting point is the stack plus a Home page.

### D2: Store is ready, not populated

**Choice:** `configureStore` with an RTK Query `api` that has no endpoints yet.

**Why:** The stack is in place without inventing domain queries.

## Risks / Trade-offs

- **[Trade-off] Unused form/validation libraries** → Kept as declared stack dependencies until a form exists.

## Migration Plan

1. Replace the previous app with the SPA scaffold and Home.
2. Remove Logto, Settings, API client, and leftover TanStack/shadcn files.
