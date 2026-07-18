# Stage 1: Build the Vite Frontend
FROM node:22-alpine AS frontend-builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Production Server
FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
# Install ts-node and typescript to execute the Express server
RUN npm install -g ts-node typescript @types/node
COPY . .
COPY --from=frontend-builder /app/dist ./dist

ENV PORT=8080
ENV NODE_ENV=production
EXPOSE 8080

CMD ["ts-node", "server/src/index.ts"]
