# ---------- deps stage: cài node_modules theo lockfile, HOISTED ----------
FROM node:20-alpine AS deps
WORKDIR /app

# Bật pnpm qua corepack
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

# Copy lockfile + package.json để tối ưu cache
COPY ./frontend/pnpm-lock.yaml ./pnpm-lock.yaml
COPY ./frontend/package.json ./package.json

# *** QUAN TRỌNG: ép hoisted layout trước khi install ***
RUN printf "node-linker=hoisted\npublic-hoist-pattern=*\n" > .npmrc

# Cài đầy đủ deps (kể cả dev) để chắc chắn có 'next' trong node_modules/
RUN --mount=type=cache,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile --prod=false || pnpm install --prod=false

# ---------- builder stage: build Next (output:'export' -> /out) ----------
FROM node:20-alpine AS builder
WORKDIR /app

# Bật pnpm ở stage này
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

# Biến môi trường public khi build
ARG NEXT_PUBLIC_API_BASE_URL=https://localhost
ENV NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL}
ENV NEXT_TELEMETRY_DISABLED=1

# Lấy node_modules + package.json từ deps
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package.json ./package.json
# Giữ đúng .npmrc hoisted để nếu cần install bổ sung vẫn đúng layout
COPY --from=deps /app/.npmrc ./.npmrc

# Nhờ .dockerignore, các thư mục node_modules/.next/out sẽ không bị copy vào
COPY ./frontend/ ./

# Build (Next 14/15 + output:'export' => tự sinh /out)
RUN pnpm build

# Gom artefact tĩnh vào /app/dist
RUN mkdir -p /app/dist && cp -r /app/out/* /app/dist/

# ---------- export stage: copy artefact sang volume cho Nginx ----------
FROM alpine:3.20
WORKDIR /export
COPY --from=builder /app/dist /export
CMD ["sh", "-lc", "cp -rf /export/* /mounted && ls -lah /mounted"]
