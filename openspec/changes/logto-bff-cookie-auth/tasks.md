## 1. API Logto MVC

- [x] 1.1 Add `Logto.AspNetCore.Authentication` and register `AddLogtoAuthentication` plus existing JWT Bearer in `Program.cs`; verify the API project restores on net10
- [x] 1.2 Add `AuthController` with `GET /auth/login` (`Challenge`), `GET /auth/logout` (`SignOut`), and `GET /auth/session`; verify session anonymous returns `{ authenticated: false }`
- [x] 1.3 Make unauthenticated JSON API challenges return 401 (not 302); verify `GET /users/me` without credentials is 401
- [x] 1.4 Add forwarded headers and `Logto:*` config in `.env.example` / README; verify documented Endpoint has a trailing slash

## 2. Web SPA

- [x] 2.1 Remove `@logto/react`, browser token storage, `/callback`, and `VITE_LOGTO_*`; verify the app builds without those symbols
- [x] 2.2 Call the API at `/api` with `credentials: 'include'` and no Bearer header; verify RTK Query tests send cookies instead of Authorization
- [x] 2.3 Drive login from `ProtectedRoute` / Entrar via top-level `/auth/login` and Home avatar via `/auth/session`; verify Home and dashboard tests

## 3. Same-origin proxy

- [x] 3.1 Update local Caddy so `web.domus.dev` proxies `/Callback`, `/SignedOutCallback`, `/auth/*`, and `/api/*` to the API; verify the Caddyfile lists those paths before the SPA
- [x] 3.2 Update the Railway front Caddyfile the same way; verify `/health` still hits the SPA Caddy

## 4. Logto Console

- [x] 4.1 Document Traditional Web App Redirect URIs `{origin}/Callback` and `{origin}/SignedOutCallback` in API and web READMEs
