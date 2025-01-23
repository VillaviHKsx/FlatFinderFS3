# Etapa 1: Construcción
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build  # Esto generará el directorio `build`

# Etapa 2: Producción
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY --from=build /app/build ./build
EXPOSE 3000
CMD ["npx", "serve", "-s", "build", "-l", "3000"]
