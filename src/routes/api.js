const express = require('express');
const { processVideo } = require('../controllers/mediaController');

const router = express.Router();

/**
 * Endpoint pour lancer le processus complet depuis une URL vidéo.
 * Corps attendu au format JSON: { "videoUrl": "https://youtu.be/..." }
 */
router.post('/process-video', processVideo);

module.exports = router;
