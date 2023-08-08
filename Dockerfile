
FROM alpine:3.18

# Utiliza una imagen base de Node.js
FROM node:18.15.0

# Establece el directorio de trabajo en el contenedor
WORKDIR /usr/src/app

# Copia el archivo package.json y package-lock.json al directorio de trabajo
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto de los archivos al directorio de trabajo
COPY . .

# Expone el puerto en el que la aplicación estará escuchando
EXPOSE 4000

# Comando para iniciar la aplicación
CMD ["node", "jwt.js"]