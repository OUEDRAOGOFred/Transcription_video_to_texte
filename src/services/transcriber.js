const fs = require('fs');
const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
});

/**
 * Envoie un fichier audio à l'API OpenAI Whisper pour transcription.
 * @param {string} audioFilePath - Chemin vers le fichier audio (ex: .mp3).
 * @returns {Promise<string>} - Une promesse qui résout avec le texte transcrit.
 */
const transcribeAudio = async (audioFilePath) => {
  try {
    console.log(`[transcriber] Envoi du fichier ${audioFilePath} à Whisper...`);
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(audioFilePath),
      model: 'whisper-large-v3',
    });
    
    console.log('[transcriber] Transcription réussie.');
    return transcription.text;
  } catch (error) {
    console.error(`[transcriber] Erreur lors de la transcription: ${error.message}`);
    throw new Error('La transcription a échoué.');
  }
};

module.exports = { transcribeAudio };
