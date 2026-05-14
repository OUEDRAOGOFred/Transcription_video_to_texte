const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

/**
 * Télécharge l'audio d'une URL vidéo via yt-dlp.
 * @param {string} videoUrl - L'URL de la vidéo (YouTube, TikTok, Facebook).
 * @returns {Promise<string>} - Une promesse qui résout avec le chemin du fichier audio .mp3.
 */
const downloadAudio = (videoUrl) => {
  return new Promise((resolve, reject) => {
    // Création d'un dossier temporaire pour les téléchargements s'il n'existe pas
    const downloadDir = path.join(__dirname, '../../downloads');
    if (!fs.existsSync(downloadDir)) {
      fs.mkdirSync(downloadDir, { recursive: true });
    }

    // Nom de fichier unique pour éviter les conflits
    const fileId = crypto.randomBytes(16).toString('hex');
    const outputTemplate = path.join(downloadDir, `${fileId}.%(ext)s`);
    const finalAudioPath = path.join(downloadDir, `${fileId}.mp3`);

    // Commande bash pour yt-dlp : extrait l'audio en mp3
    // Options utilisées pour contourner les protections YouTube :
    // -x --audio-format mp3 : extrait l'audio en mp3
    // --js-runtimes node : utilise Node.js pour l'extraction JavaScript de YouTube
    // --user-agent : se fait passer pour un navigateur Chrome
    // --extractor-args youtube:player_client=web : force le client web (pas mobile)
    // --socket-timeout 30 : augmente le timeout réseau
    // --sleep-interval 1 : ajoute 1 seconde de délai pour paraître moins comme un bot
    // --retries 5 : réessaie jusqu'à 5 fois en cas d'erreur réseau
    // --http-chunk-size 10485760 : taille de chunk pour les gros fichiers
    // --skip-unavailable-fragments : saute les fragments indisponibles
    const command = `yt-dlp -x --audio-format mp3 --js-runtimes node --user-agent "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" --extractor-args "youtube:player_client=web" --socket-timeout 30 --sleep-interval 1 --retries 5 --http-chunk-size 10485760 --skip-unavailable-fragments -o "${outputTemplate}" "${videoUrl}"`;

    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`[downloader] Erreur lors du téléchargement: ${error.message}`);
        console.error(`[downloader] stderr: ${stderr}`);
        return reject(new Error('Échec du téléchargement ou de l\'extraction de l\'audio.'));
      }

      // yt-dlp sauvegardera le fichier avec l'extension .mp3 en fonction du template
      if (fs.existsSync(finalAudioPath)) {
        console.log(`[downloader] Audio extrait avec succès: ${finalAudioPath}`);
        resolve(finalAudioPath);
      } else {
        console.error(`[downloader] Fichier final non trouvé: ${finalAudioPath}`);
        reject(new Error('Le fichier audio final n\'a pas pu être trouvé.'));
      }
    });
  });
};

module.exports = { downloadAudio };
