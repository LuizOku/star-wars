# Etapa 1: build
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

RUN npm run build

# Etapa 2: imagem final
FROM node:20-alpine AS runner

WORKDIR /app

# Apenas as dependências de produção (opcional)
COPY --from=builder /app/package.json /app/package-lock.json ./
RUN npm install --omit=dev

# Copia build do Next
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/postcss.config.mjs ./

ENV NODE_ENV=production

EXPOSE 3000

CMD ["npx", "next", "start"]
