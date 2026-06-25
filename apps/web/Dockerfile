# CompHub web — built from the monorepo root context so workspace packages resolve.
# The API base is baked at build time; the browser (on the host) calls the published
# api port directly, so the default matches docker-compose's published :4000.
FROM node:20-bookworm AS build
WORKDIR /app
COPY . .
RUN npm install
ARG VITE_COMPHUB_API_URL=http://localhost:4000
ENV VITE_COMPHUB_API_URL=$VITE_COMPHUB_API_URL
RUN npm run build -w apps/web

FROM node:20-bookworm-slim AS run
WORKDIR /app
COPY --from=build /app /app
ENV PORT=3000
EXPOSE 3000
# `vite preview` serves the built SPA on 0.0.0.0:$PORT.
CMD ["npm", "run", "start", "-w", "apps/web"]
