# ===== Stage 1: Builder =====
FROM node:20 AS builder

WORKDIR /app

# 1. 先複製 package.json 和 lock 檔（利用 Docker cache）
COPY package.json pnpm-lock.yaml ./

# 2. 啟用 pnpm
RUN corepack enable

# 3. 安裝所有依賴
RUN pnpm install

# 4. 複製其他原始碼
COPY . .

# 5. build TypeScript
RUN pnpm build


# ===== Stage 2: Runner =====
FROM node:20-slim AS runner

WORKDIR /app

RUN corepack enable

# 只複製必要檔案（從 builder 拿 dist，從本機拿 package.json）
COPY --from=builder /app/dist ./dist
COPY package.json pnpm-lock.yaml ./

# 只安裝 production 依賴（不裝 devDependencies）
RUN pnpm install --prod

EXPOSE 3000

CMD ["node", "dist/main"]