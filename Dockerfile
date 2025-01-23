# Etapa 1: Construcción
FROM node:18-alpine AS build
WORKDIR /app

# Copiar archivos necesarios e instalar dependencias
COPY package*.json ./
RUN npm install

# Copiar el resto de los archivos y construir la aplicación
COPY . .
RUN npm run build  # Esto generará el directorio `build`

# Etapa 2: Servir con Nginx
FROM nginx:alpine
# Copiar los archivos construidos al directorio de Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Configurar un archivo Nginx personalizado (opcional)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer el puerto que utiliza Nginx
EXPOSE 80

# Arrancar Nginx
CMD ["nginx", "-g", "daemon off;"]
