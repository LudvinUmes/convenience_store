# Etapa 1: construcción de la app
FROM node:22 as builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY prisma ./prisma
COPY src ./src
COPY . .
RUN npx prisma generate
RUN npm run build

# Etapa 2: imagen final de producción
FROM node:22-alpine

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY package*.json ./

EXPOSE 3003

CMD ["node", "dist/src/main"]
