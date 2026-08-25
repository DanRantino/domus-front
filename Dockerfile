# Build
FROM node:24-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Railway injects matching --build-arg for service variables.
# Vite only inlines VITE_* present as ENV during `vite build`.
ARG VITE_LOGTO_ENDPOINT
ARG VITE_LOGTO_APP_ID
ARG VITE_LOGTO_API_RESOURCE
ARG VITE_LOGTO_PASSWORD_URL
ARG VITE_DOMUS_API_BASE_URL

ENV VITE_LOGTO_ENDPOINT=$VITE_LOGTO_ENDPOINT \
    VITE_LOGTO_APP_ID=$VITE_LOGTO_APP_ID \
    VITE_LOGTO_API_RESOURCE=$VITE_LOGTO_API_RESOURCE \
    VITE_LOGTO_PASSWORD_URL=$VITE_LOGTO_PASSWORD_URL \
    VITE_DOMUS_API_BASE_URL=$VITE_DOMUS_API_BASE_URL

RUN npm run build

# Runtime — TLS terminates at the Railway edge
FROM caddy:2-alpine
COPY Caddyfile /etc/caddy/Caddyfile
COPY --from=build /app/dist /srv
