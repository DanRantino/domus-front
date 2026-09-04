## 1. API GraphQL me

- [x] 1.1 Add HotChocolate.AspNetCore to Domus.Api and map authenticated `/graphql` after CurrentUserMiddleware
- [x] 1.2 Add GraphQL types for `Me`, `UserProfile`, and `MeHouse` and a `me` query resolved through MeService
- [x] 1.3 Return GraphQL `not_provisioned` for authenticated callers without a Domus User; return HTTP 401 when unauthenticated; do not provision from `me`

## 2. API tests

- [x] 2.1 Cover GraphQL `me` unauthenticated → 401
- [x] 2.2 Cover authenticated unprovisioned → `not_provisioned` without creating a User
- [x] 2.3 Cover provisioned `me` with empty houses and with membership `id`/`name`/`role`

## 3. Frontend GraphQL bootstrap

- [x] 3.1 Add a GraphQL POST helper that parses `{ data, errors }` and triggers silent `POST /users/me` on `not_provisioned`
- [x] 3.2 Switch RTK Query `getMe` to GraphQL `me` and align the `Me` type with `name`, `profile`, and `houses`
- [x] 3.3 Point `useMyHouseholds` at `me.houses`; keep REST `GET /houses` for create/detail
- [x] 3.4 Update SPA mocks and tests for GraphQL `me` and household-list bootstrap
