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
# Install tsx and typescript to execute the Express server
RUN npm install -g tsx typescript @types/node
COPY . .
COPY --from=frontend-builder /app/dist ./dist

ENV PORT=8080
ENV NODE_ENV=production
EXPOSE 8080

CMD ["npx", "tsx", "server/src/index.ts"]
