# syntax=docker/dockerfile:1
#
# Single multi-stage image for every Nest app in this monorepo.
#   docker build --build-arg APP=api-gateway -t messenger-backend/api-gateway .
#   APP ∈ { api-gateway, auth, characters }
#
# Node version is pinned to the exact version in .nvmrc (16.20.2).
# Debian slim (not alpine) because bcrypt is a native module.

ARG NODE_IMAGE=node:16.20.2-bookworm-slim

# ---------------------------------------------------------------------------
# build: full deps + webpack bundle for a single app
# ---------------------------------------------------------------------------
FROM ${NODE_IMAGE} AS build
WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --non-interactive

COPY nest-cli.json tsconfig.json tsconfig.build.json ./
COPY libs ./libs
COPY apps ./apps

ARG APP
RUN test -n "$APP" || (echo "Build arg APP is required" >&2 && exit 1) \
 && yarn nest build "$APP"

# ---------------------------------------------------------------------------
# runtime: production deps only (webpack keeps node_modules external)
# ---------------------------------------------------------------------------
FROM ${NODE_IMAGE} AS runtime
ENV NODE_ENV=production
WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production --non-interactive \
 && yarn cache clean

ARG APP
# ARG does not survive into the running container; persist it as ENV for CMD.
ENV APP=${APP}

COPY --from=build --chown=node:node /app/dist/apps/${APP} ./dist/apps/${APP}

USER node

# exec => node becomes PID 1 and receives SIGTERM from `docker stop`.
CMD exec node "dist/apps/${APP}/main.js"
