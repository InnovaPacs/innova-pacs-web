FROM node:20-alpine as build-stage
WORKDIR /app

# Habilitar pnpm via corepack (viene incluido en Node 18)
RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-lock.yaml /app/
RUN pnpm install --frozen-lockfile

COPY ./ /app/
RUN pnpm run build:dev

FROM nginx:alpine
COPY --from=build-stage /app/dist/med-iq/browser /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf