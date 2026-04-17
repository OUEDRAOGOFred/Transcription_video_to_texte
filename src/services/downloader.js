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
    const command = `yt-dlp -x --audio-format mp3 -o "${outputTemplate}" "${videoUrl}"`;

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
