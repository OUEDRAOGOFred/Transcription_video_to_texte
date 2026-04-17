# 🎥 Plateforme de Transcription Vidéo en Texte

Une application full-stack professionnelle (Backend Node.js / Frontend HTML+CSS Pur) permettant d'extraire l'audio d'une vidéo (YouTube, Facebook, TikTok, etc.), de le transcrire en texte grâce à l'intelligence artificielle (Groq / Whisper), et de générer un document PDF téléchargeable. Le tout est historisé dans une base de données MySQL.

## ✨ Fonctionnalités
- **Extraction Audio** : Téléchargement rapide de l'audio via `yt-dlp` et `ffmpeg`.
- **Transcription Ultra-rapide** : Utilisation du modèle `whisper-large-v3` via l'API Groq pour une conversion Speech-to-Text presque instantanée.
- **Génération PDF** : Création propre et formatée d'un document PDF avec `pdfkit`.
- **Interface Utilisateur (UI)** : Frontend épuré écrit en CSS natif (sans framework) avec gestion des états (Chargement, Erreur, Succès), interface claire et professionnelle.
- **Base de Données** : Sauvegarde de l'historique des transcriptions via MySQL (requêtes SQL pures, sans ORM).
- **Conteneurisation** : Prêt pour la production avec un `Dockerfile` optimisé et `docker-compose`.

## 🛠️ Stack Technique
- **Backend** : Node.js, Express.js
- **Base de données** : MySQL (`mysql2`)
- **IA / Speech-to-Text** : API Groq (Modèle OpenAI Whisper-large-v3)
- **Utilitaires** : `yt-dlp` (téléchargement), `ffmpeg` (conversion audio), `pdfkit` (génération de documents)
- **Frontend** : HTML5, CSS3 pur, SVGs (Lucide Icons)
- **Déploiement** : Docker, Docker Compose

## 🚀 Prérequis (Installation Locale)
Pour faire tourner le projet localement natif sur votre machine, assurez-vous d'avoir installé :
- [Node.js](https://nodejs.org/) (v18+)
- [MySQL](https://www.mysql.com/)
- [yt-dlp](https://github.com/yt-dlp/yt-dlp) & [FFmpeg](https://ffmpeg.org/) (et ajoutés au PATH système)
- Une [Clé API Groq](https://console.groq.com/)

## 💻 Installation & Démarrage rapide

1. **Cloner le dépôt**
   ```bash
   git clone https://github.com/OUEDRAOGOFred/Transcription_video_to_texte.git
   cd Transcription_video_to_texte
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configuration des variables d'environnement**
   Créez un fichier `.env` à la racine du projet :
   ```env
   DATABASE_URL=mysql://root:VOTRE_MOT_DE_PASSE@localhost:3306/transcription_db
   GROQ_API_KEY=gsk_votre_cle_api_groq
   PORT=3000
   ```

4. **Initialiser la base de données**
   Exécutez le script SQL `init.sql` dans votre client MySQL (ex: phpMyAdmin, interface de commande) pour créer la base de données `transcription_db` et la table `transcriptions`.

5. **Démarrer le serveur**
   ```bash
   npm run dev
   ```
   Rendez-vous ensuite sur `http://localhost:3000` via votre navigateur.

## 🐳 Déploiement avec Docker (Recommandé)
Si vous avez Docker d'installé et que vous préférez ne pas toucher à votre environnement local, vous pouvez lancer l'application et la base de données très simplement. (Docker téléchargera lui-même Node, FFmpeg, Python et MySQL !).

1. Configurez simplement votre `<GROQ_API_KEY>` dans votre fichier `.env`.
2. Exécutez la commande :
   ```bash
   docker compose up -d
   ```
Rendez-vous sur `http://localhost:3000` !

## 📁 Structure du Projet
```text
├── Dockerfile
├── docker-compose.yml
├── init.sql                # Script de création DB (MySQL)
├── package.json
├── public/                 
│   └── index.html          # Frontend (UI CSS natif)
├── src/
│   ├── config/
│   │   └── db.js           # Connexion DB au format Pool
│   ├── controllers/
│   │   └── mediaController.js # Orchestration 
│   ├── routes/
│   │   └── api.js          # Définition des endpoints REST
│   ├── services/
│   │   ├── downloader.js   # Wrapper enfant sur yt-dlp
│   │   ├── pdfGenerator.js # Logique module PDFKit
│   │   └── transcriber.js  # Client API Groq
│   └── index.js            # Initialisation serveur Express.js
└── .env                    # Fichier de secret (non versionné)
```

---
*Développé dans le cadre d'un process complet d'architecture Backend moderne sans ORM et traitement asynchrone AI.*