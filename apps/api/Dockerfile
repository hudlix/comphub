# CompHub API — built from the monorepo root context so workspace packages resolve.
# Build stage uses the full image (native better-sqlite3 prebuilds); runtime is slim.
FROM node:20-bookworm AS build
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build -w apps/api

FROM node:20-bookworm-slim AS run
WORKDIR /app
COPY --from=build /app /app
ENV NODE_ENV=production
ENV PORT=4000
EXPOSE 4000
CMD ["node", "apps/api/dist/index.js"]
