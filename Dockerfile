# Utilisez l'image Node.js officielle comme base
FROM node:20

# Définissez le répertoire de travail dans le conteneur
WORKDIR /usr/src/app

# Copiez les fichiers du package.json et du package-lock.json pour installer les dépendances
COPY package*.json ./

# Installez les dépendances
RUN npm install

# Copiez le reste des fichiers de l'application
COPY . .

# Construisez l'application React pour la production
RUN npm run build

EXPOSE 3000

# Commande pour démarrer l'application
CMD ["npm", "start"]