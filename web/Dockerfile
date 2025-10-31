FROM node:latest

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar archivos de la aplicación
COPY . .

# Exponer puerto
EXPOSE 3000

# Comando para iniciar servidor de desarrollo
CMD ["npm", "run", "dev", "--", "--port", "3000"]
