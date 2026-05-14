# Utilisation d'une image Debian bookworm plus récente qui a Python 3.11 par défaut
FROM node:20-bookworm

# Définir le répertoire de travail dans le conteneur
WORKDIR /usr/src/app

# Variables d'environnement pour Python (nécessaire à yt-dlp)
ENV PYTHONUNBUFFERED=1

# Installation de dépendances systèmes essentielles (bookworm fournit python3.11)
RUN apt-get update && apt-get install -y \
    ffmpeg \
    python3 \
    python3-pip \
    curl \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Forcer l'utilisation de python3.11 comme default si nécessaire
RUN ln -sf /usr/bin/python3.11 /usr/bin/python

# Installer yt-dlp via pip (pour les mises à jour régulières et la compatibilité YouTube maximale)
# Puis installer les dépendances recommandées pour une meilleure extraction YouTube
RUN pip install --no-cache-dir yt-dlp pysocks brotli

# Copie des fichiers package.json et package-lock.json avant le code source 
# Cela permet d'optimiser le cache Docker pour les couches deps
COPY package*.json ./

# Installer uniquement les dépendances de production
RUN npm install --production

# Créer les dossiers nécessaires (s'ils ne sont pas construits dynamiquement, c'est mieux de les prévoir)
RUN mkdir -p downloads outputs

# Copier le reste du projet
COPY . .

# Exposer le port de l'API Express
EXPOSE 3000

# Démarrer l'application avec la configuration package.json
CMD ["npm", "start"]
