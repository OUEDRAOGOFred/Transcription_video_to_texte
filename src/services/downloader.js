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
    // --user-agent : navigateur Chrome authentifié
    // --cookies-from-browser chrome : charge les cookies du navigateur Chrome système
    // --extractor-args youtube:player_client=web : force le client web
    // --socket-timeout 30 : augmente le timeout réseau
    // --sleep-interval 2 : délai pour paraître humain
    // --retries 10 : réessaie jusqu'à 10 fois
    // --http-chunk-size 10485760 : taille de chunk pour gros fichiers
    // --skip-unavailable-fragments : saute fragments indisponibles
    // --fragment-retries 10 : réessaie les fragments
    const command = `yt-dlp -x --audio-format mp3 --js-runtimes node --user-agent "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" --extractor-args "youtube:player_client=web;youtube:ignore_signaling=true" --socket-timeout 30 --sleep-interval 2 --retries 10 --http-chunk-size 10485760 --skip-unavailable-fragments --fragment-retries 10 --extractor-args "youtube:age_gate=true" -o "${outputTemplate}" "${videoUrl}"`;

    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`[downloader] Erreur yt-dlp: ${error.message}`);
        console.warn('[downloader] Tentative avec pytube en fallback...');
        // Fallback avec pytube (alternative Python)
        tryPytubeFallback(videoUrl, finalAudioPath, downloadDir, resolve, reject);
        return;
      }

      // yt-dlp sauvegardera le fichier avec l'extension .mp3 en fonction du template
      if (fs.existsSync(finalAudioPath)) {
        console.log(`[downloader] Audio extrait avec succès via yt-dlp: ${finalAudioPath}`);
        resolve(finalAudioPath);
      } else {
        console.error(`[downloader] Fichier final non trouvé: ${finalAudioPath}`);
        // Tentative fallback
        tryPytubeFallback(videoUrl, finalAudioPath, downloadDir, resolve, reject);
      }
    });
  });
};

/**
 * Fallback : télécharge via pytube (alternative Python)
 */
const tryPytubeFallback = (videoUrl, finalAudioPath, downloadDir, resolve, reject) => {
  // Créer un script Python simple pour éviter les problèmes d'échappement
  const scriptPath = path.join(downloadDir, `pytube_${crypto.randomBytes(8).toString('hex')}.py`);
  
  const pythonCode = `import sys
from pytube import YouTube
import os
from moviepy.editor import AudioFileClip

try:
    yt = YouTube('${videoUrl}')
    stream = yt.streams.filter(only_audio=True).first()
    if stream:
        temp_path = stream.download(output_path='${downloadDir}')
        # Si le fichier n'est pas en .mp3, le convertir
        if not temp_path.endswith('.mp3'):
            audio_clip = AudioFileClip(temp_path)
            audio_clip.write_audiofile('${finalAudioPath}', verbose=False, logger=None)
            audio_clip.close()
            if os.path.exists(temp_path):
                os.remove(temp_path)
        else:
            os.rename(temp_path, '${finalAudioPath}')
        print(f"Success:${finalAudioPath}")
    else:
        print("Error:No audio stream found")
except Exception as e:
    print(f"Error:{str(e)}")
finally:
    sys.exit(0)`;

  // Écrire le script dans un fichier temporaire
  fs.writeFileSync(scriptPath, pythonCode);

  // Exécuter le script Python
  exec(`python3 '${scriptPath}'`, (error, stdout, stderr) => {
    // Nettoyer le fichier temporaire
    try { fs.unlinkSync(scriptPath); } catch (e) {}
    
    const output = stdout.trim();
    if (output.startsWith('Success:')) {
      const audioPath = output.replace('Success:', '').trim();
      console.log(`[downloader] Audio extrait avec succès via pytube: ${audioPath}`);
      resolve(audioPath);
    } else {
      const errorMsg = output.startsWith('Error:') ? output.replace('Error:', '') : stderr;
      console.error(`[downloader] Erreur pytube: ${errorMsg}`);
      reject(new Error('Échec du téléchargement via yt-dlp et pytube.'));
    }
  });
};

module.exports = { downloadAudio };
