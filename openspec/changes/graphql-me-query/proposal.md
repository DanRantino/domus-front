## Why

The SPA currently bootstraps the authenticated user from REST (`GET /users/me` is underused; shell and household gate load memberships via `GET /houses`). A single GraphQL `me` query should be the current-user read so the frontend can resolve profile, display name, and house memberships in one request without migrating the rest of the API.

## What Changes

- Add an authenticated GraphQL endpoint (`POST /graphql`) with a `me` query that returns `id`, `name`, `profile` (theme and notification preferences), and `houses` (`id`, `name`, `role`).
- The frontend current-user bootstrap (`getMe` / `useMe`) MUST use that GraphQL query instead of `GET /users/me`.
- The frontend membership list used by shell and household gate (`useMyHouseholds`) MUST come from `me.houses`.
- Silent self-serve provisioning remains REST `POST /users/me` after a typed `not_provisioned` denial from the GraphQL `me` query.
- REST `GET /users/me` and `GET /houses` remain available; they are not the SPA bootstrap read.

## Capabilities

### New Capabilities

- (none)

### Modified Capabilities

- `users`: Current-user read for the SPA is the GraphQL `me` query (equivalent to `GET /me`). Success payload is `id`, `name`, `profile`, and `houses` with `id`/`name`/`role`. Unauthenticated vs unprovisioned vs provisioned outcomes stay distinct. REST `GET/POST /users/me` remain valid; GraphQL `me` MUST NOT provision.

## Impact

- **API (`domus-api`)**: HotChocolate GraphQL server at `/graphql`, `me` resolver over existing `MeService`, authorization matching other product endpoints.
- **Frontend (`domus-web`)**: RTK Query `getMe` via `POST /graphql`, silent provision on GraphQL `not_provisioned`, `useMyHouseholds` reads `me.houses`.
- **Unaffected**: House create/detail REST, invitations, Settings/`PATCH /me`, GraphQL mutations, Apollo/codegen.
