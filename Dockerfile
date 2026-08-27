# Build
FROM node:24-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Railway injects matching --build-arg for service variables.
# Vite only inlines VITE_* present as ENV during `vite build`.
ARG VITE_DOMUS_API_BASE_URL=/api

ENV VITE_DOMUS_API_BASE_URL=$VITE_DOMUS_API_BASE_URL

RUN npm run build

# Runtime — TLS terminates at the Railway edge
FROM caddy:2-alpine
COPY Caddyfile /etc/caddy/Caddyfile
COPY --from=build /app/dist /srv
CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile", "--adapter", "caddyfile"]
