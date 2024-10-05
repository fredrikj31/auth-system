FROM node:20-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS build

WORKDIR /app
COPY . /usr/src/app
WORKDIR /usr/src/app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run -r build
RUN pnpm deploy --filter=app --prod /app

FROM base AS app
COPY --from=build /app/build /app
WORKDIR /app
EXPOSE 8000
CMD [ "pnpm", "dlx", "serve", "-l", "8000" ]