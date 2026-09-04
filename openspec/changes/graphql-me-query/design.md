## Context

See proposal.md for motivation. The API already has `MeService` plus REST `GET/POST /users/me`. The SPA uses RTK Query, cookie BFF (`credentials: 'include'`), and silent provision in `domusBaseQuery` on REST `403`/`not_provisioned`. Caddy `handle_path /api/*` already forwards `/api/graphql` to `/graphql`. There is no GraphQL stack today.

## Goals / Non-Goals

**Goals:**

- Add a code-first GraphQL `me` query in the API layer over existing `MeService`.
- Keep GraphQL errors out of the REST envelope.
- Keep RTK Query as the SPA data layer with a small GraphQL POST helper (no Apollo).
- Preserve silent provision as REST `POST /users/me`.

**Non-Goals:**

- GraphQL mutations, codegen, or a general GraphQL client library.
- Removing REST `GET /users/me` or `GET /houses`.
- Changing Application/Domain models beyond mapping empty `FullName` to GraphQL `null`.

## Decisions

### D1: HotChocolate on the existing API host

**Choice:** Add `HotChocolate.AspNetCore` to `Domus.Api`, map `POST /graphql`, require authorization on the endpoint. Types and resolvers live in Api; they call `MeService`.

**Why:** Same process, same cookie/JWT schemes, same `CurrentUserMiddleware`. GraphQL is an HTTP concern.

**Alternatives considered:** Separate GraphQL service (rejected — unnecessary); graphql-dotnet (HotChocolate is the usual ASP.NET choice).

### D2: Nested GraphQL shape, unchanged REST shape

**Choice:** GraphQL uses camelCase `name` + nested `profile` + `houses { id name role }`. REST `/users/me` stays flat snake_case.

**Why:** Matches the product bootstrap query without a breaking REST change.

**Alternatives considered:** Mirror REST fields in GraphQL (rejected — this change is the nested bootstrap); change REST to match GraphQL (out of scope).

### D3: Typed GraphQL `not_provisioned`, HTTP 401 for anonymous

**Choice:** Unauthenticated requests fail at the endpoint (HTTP 401). Authenticated-but-unprovisioned `me` returns HTTP 200 with `errors[].extensions.code = "not_provisioned"`. The resolver MUST NOT throw an unhandled exception that the REST exception middleware would wrap.

**Why:** GraphQL keeps 200 for field errors; 401 stays aligned with REST auth. Frontend maps the extension code to the existing provision flow.

**Alternatives considered:** HTTP 403 for GraphQL (non-idiomatic); `me: Me` nullable without an error (weaker than a typed denial).

### D4: RTK Query `queryFn` for GraphQL

**Choice:** `getMe` uses a dedicated GraphQL execute helper (POST `/graphql`, parse `{ data, errors }`, silent `POST /users/me` + retry). Do not run GraphQL through the REST envelope parser.

**Why:** GraphQL responses are not `{ success, data, error }`. A tiny helper avoids Apollo and keeps one store.

**Alternatives considered:** Apollo Client (extra stack); teach `domusBaseQuery` to detect GraphQL (mixes contracts).

### D5: Shell memberships from `me.houses`

**Choice:** `useMyHouseholds` reads `getMe` → `houses`. `GET /houses` remains for create/detail and the `Houses` cache tag.

**Why:** One bootstrap round-trip for profile + memberships.

**Alternatives considered:** Keep `GET /houses` for the gate (duplicates the query this change exists to replace).

## Risks / Trade-offs

- **[Risk] Silent provision misses GraphQL errors** → Map `extensions.code === "not_provisioned"` (and retry after `POST /users/me` / `409`) in the GraphQL helper, not only HTTP 403 envelopes.
- **[Risk] Exception middleware swallows GraphQL errors** → Use HotChocolate field errors; do not throw raw exceptions from the `me` resolver.
- **[Trade-off] Dual current-user reads** → REST `GET /users/me` stays for compatibility; SPA bootstrap is GraphQL-only in this change.

## Migration Plan

1. Ship API `/graphql` + tests; REST unchanged.
2. Switch SPA `getMe` and `useMyHouseholds`; update mocks/tests.
3. Rollback is revert of both PRs; no data migration.

## Open Questions

- (none)
