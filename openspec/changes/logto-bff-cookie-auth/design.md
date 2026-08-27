## Context

See proposal.md for motivation. The web app is a React SPA; the API is ASP.NET with JWT Bearer today. Logto documents the server flow in the .NET Core MVC quick start: `AddLogtoAuthentication`, `Challenge` / `SignOut`, default `/Callback` and `/SignedOutCallback`. That tutorial assumes Razor views in the same app. The extras below exist only because the Domus “view” is a separate SPA.

## Goals / Non-Goals

**Goals:**

- Follow the Logto MVC tutorial on ASP.NET (cookie + OIDC handlers, no custom callback).
- Keep the current React SPA; no Identity Provider tokens in the browser.
- Same-origin so the session cookie is first-party.
- Keep JWT Bearer for future non-browser clients.
- JSON `[Authorize]` responses MUST be 401, not a redirect to Logto.

**Non-Goals:**

- TanStack Start, Redis, or a custom session store.
- Changing `CallbackPath` away from `/Callback`.
- Silent `POST /me` provisioning, Settings/Account API, or mobile clients.

## Decisions

### D1: Tutorial defaults, not a custom callback path
**Choice:** Leave `CallbackPath` = `/Callback` and `SignedOutCallbackPath` = `/SignedOutCallback`. Register those URIs on the SPA origin in the Logto Console.  
**Why:** Matches the tutorial; the SDK owns the callback.  
**Alternatives:** `/api/Callback` plus PathBase — extra moving parts the tutorial does not need.

### D2: Same-origin by proxying tutorial paths
**Choice:** Caddy on the web origin forwards `/Callback`, `/SignedOutCallback`, `/auth/*`, and `/api/*` to ASP.NET. Strip `/api` so existing routes (`/users/me`, `/houses`) stay. Forward `X-Forwarded-Proto` and `X-Forwarded-Host` so the OIDC redirect URI is `https://web.domus.dev/Callback`.  
**Why:** Cookie is first-party; React can `fetch('/api/users/me')`.  
**Alternatives:** Cross-origin cookie on `api.*` — SameSite and CORS credentials; rejected for this change.

### D3: SignIn / SignOut as in the tutorial
**Choice:** `GET /auth/login` returns `Challenge(new AuthenticationProperties { RedirectUri = ... })`. `GET /auth/logout` returns `SignOut(...)`. RedirectUri is a relative path (`/` or `/dashboard`).  
**Why:** Same handlers the MVC sample uses; the SPA is just the link target.  
**Alternatives:** Implementing callback in React — rejected.

### D4: JSON session instead of Razor `User.Identity`
**Choice:** `GET /auth/session` returns `{ authenticated, picture, name }` from cookie claims (`LogtoParameters.Claims`). Anonymous callers get `{ authenticated: false }`.  
**Why:** Public Home needs the IdP avatar without a Domus User and without ID tokens in the browser.  
**Alternatives:** Infer session only from `GET /users/me` — 403 vs 401 vs guest is enough for product access, but Home avatar is IdP identity even when unprovisioned.

### D5: 401 for API JSON, Challenge for login
**Choice:** Keep SDK default challenge for `/auth/login`. For API JSON routes, unauthenticated challenge returns 401. Authenticate Cookie when there is no Bearer header, JwtBearer when there is.  
**Why:** `fetch` must not follow an HTML redirect to Logto.  
**Alternatives:** Changing the SDK default challenge globally — would break SignIn.

### D6: Logto config keys from the tutorial
**Choice:** `Logto:Endpoint` (tenant URL with trailing slash), `Logto:AppId`, `Logto:AppSecret`. Keep `Authentication:Authority` and `Authentication:Audience` for JWT Bearer. `options.Resource` = Audience.  
**Why:** Endpoint concatenated with `oidc` inside the SDK; Authority already includes `/oidc`.  
**Alternatives:** Reusing Authority as Endpoint — produces `.../oidcoidc`.

## Risks / Trade-offs

- **[Risk] SPA catches `/Callback`** → Caddy MUST list `/Callback` and `/SignedOutCallback` before the SPA fallback.
- **[Risk] Wrong public redirect URI** → Forwarded headers; verify Console URI equals what the middleware emits.
- **[Risk] Multiple API replicas** → Data Protection keys not shared; stay on one replica for now.
- **[Trade-off] Traditional Web app in Logto** → New confidential client; existing SPA app is unused by the web client.

## Migration Plan

1. Create the Traditional Web application in Logto; set Redirect URIs.
2. Ship API Logto cookie + Bearer; keep tests for 401 vs 302.
3. Switch the SPA to `/api` + cookie; remove `@logto/react`.
4. Point Caddy (local and Railway) at the new routes.
5. Confirm login: Home Entrar → `/auth/login` → Logto → `/Callback` → cookie → `/dashboard`.
