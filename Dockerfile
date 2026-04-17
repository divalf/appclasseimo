# ── Stage 1: compila dependências nativas (better-sqlite3) ────────────────
FROM node:20-alpine AS builder
RUN apk add --no-cache python3 make g++
WORKDIR /app
COPY package.json ./
RUN npm install --omit=dev

# ── Stage 2: imagem final ─────────────────────────────────────────────────
FROM node:20-alpine
WORKDIR /app

# Dependências compiladas
COPY --from=builder /app/node_modules ./node_modules

# Banco inicial como seed (fora do ponto de montagem do volume)
COPY db/classes_imo.db /db-seed/classes_imo.db

# Arquivos do app
COPY . .

RUN chmod +x entrypoint.sh

EXPOSE 3000
ENTRYPOINT ["./entrypoint.sh"]
