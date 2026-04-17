const { downloadAudio } = require('../services/downloader');
const { transcribeAudio } = require('../services/transcriber');
const { generatePDF } = require('../services/pdfGenerator');
const db = require('../config/db');

/**
 * Orchestrateur de la route de traitement vidéo
 * @route POST /api/process-video
 */
const processVideo = async (req, res) => {
  const { videoUrl } = req.body;

  if (!videoUrl) {
    return res.status(400).json({ error: 'L\'URL de la vidéo est requise dans le corps de la requête.' });
  }

  let audioPath = null;
  let text = null;
  let pdfPath = null;

  try {
    // 1. Extraire l'audio via yt-dlp
    console.log(`[controller] Étape 1 : Téléchargement audio pour l'URL ${videoUrl}`);
    audioPath = await downloadAudio(videoUrl);

    // 2. Transcrire avec Whisper
    console.log(`[controller] Étape 2 : Transcription de ${audioPath}`);
    text = await transcribeAudio(audioPath);

    // 3. Générer le fichier PDF
    console.log(`[controller] Étape 3 : Génération du PDF avec le texte transcrit`);
    pdfPath = await generatePDF(text, videoUrl);

    // 4. Sauvegarder dans MySQL en SQL pur (avec gestion d'erreur dédiée sans ORM)
    console.log(`[controller] Étape 4 : Sauvegarde en base de données`);
    const insertQuery = `
      INSERT INTO transcriptions (video_url, transcript_text, pdf_path, status, created_at)
      VALUES (?, ?, ?, 'COMPLETED', NOW())
    `;
    const dbParams = [videoUrl, text, pdfPath];

    const [dbResult] = await db.query(insertQuery, dbParams);
    const savedRecordId = dbResult.insertId;

    console.log(`[controller] Processus terminé avec succès. ID: ${savedRecordId}`);
    
    // Générer une URL de téléchargement publique basée sur le nom de fichier final
    const pdfFileName = require('path').basename(pdfPath);
    const pdfDownloadUrl = `/downloads/${pdfFileName}`;

    // Réussite
    res.status(200).json({
      message: 'Vidéo traitée avec succès.',
      data: {
        id: savedRecordId,
        videoUrl: videoUrl,
        transcriptionLength: text.length,
        pdfUrl: pdfDownloadUrl,
      }
    });

  } catch (error) {
    console.error(`[controller] Une erreur est survenue lors du traitement global: ${error.message}`);
    
    // Si l'erreur arrive au milieu, on pourrait vouloir marquer le statut FAILED en DB, mais on l'omet ici pour rester simple
    res.status(500).json({
      error: 'Erreur interne lors du traitement de la vidéo.',
      details: error.message
    });
  }
};

module.exports = { processVideo };
