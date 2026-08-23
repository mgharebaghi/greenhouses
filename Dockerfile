FROM node:22-alpine AS builder

WORKDIR /app

RUN apk add --no-cache curl

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate

RUN npm run build


FROM node:22-alpine

WORKDIR /app

RUN apk add --no-cache curl

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

COPY --from=builder /app/app/generated ./app/app/generated
COPY --from=builder /app/prisma ./prisma

ENV HOSTNAME=0.0.0.0

EXPOSE 3000

CMD ["sh", "-c", "HOSTNAME=0.0.0.0 node server.js"]