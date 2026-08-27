## Why

The frontend today runs the Logto OIDC flow in the browser and stores tokens in `sessionStorage`. Tokens in JavaScript storage are the wrong place for a long-lived household product. Logto already ships `Logto.AspNetCore.Authentication`, which owns cookie, callback, logout, and token refresh on the server.

## What Changes

- **BREAKING:** The web client no longer obtains Identity Provider tokens or sends Bearer access tokens. Login is a top-level navigation to the ASP.NET BFF (`Challenge` / `SignOut` from the Logto MVC tutorial).
- The Domus API becomes the authentication BFF: `AddLogtoAuthentication`, HttpOnly cookie, default `/Callback` and `/SignedOutCallback`.
- The SPA calls the API same-origin (`/api/...` with `credentials: 'include'`). A same-origin proxy forwards `/Callback`, `/SignedOutCallback`, `/auth/*`, and `/api/*` to ASP.NET.
- The frontend exposes Identity Provider session state (avatar on public Home) via `GET /auth/session`, not ID-token claims in the browser.
- JWT Bearer validation remains for future non-browser clients. Unauthenticated JSON API calls return HTTP 401, not a redirect to Logto.
- Remove `@logto/react`, browser token storage, and the `/callback` SPA route.

## Capabilities

### New Capabilities

- _(none)_

### Modified Capabilities

- `users`: Frontend authenticates through the ASP.NET BFF cookie session instead of browser OIDC/PKCE and Bearer tokens. Tokens MUST NOT appear in `localStorage` or `sessionStorage`. Dashboard login starts a top-level BFF challenge. Public Home still shows IdP identity from the BFF session.

## Impact

- **domus-web:** Auth provider, protected routes, RTK Query base URL/`credentials`, Home session avatar, tests, env (`VITE_LOGTO_*` removed).
- **domus-api:** `Logto.AspNetCore.Authentication` beside existing JWT Bearer, `AuthController`, forwarded headers, 401 on JSON challenge.
- **domus-dev / Railway Caddy:** Same-origin routes for callback, auth, and `/api`.
- **Logto Console:** Traditional Web application; Redirect URIs `{origin}/Callback` and `{origin}/SignedOutCallback`.
