const express = require('express');
const bodyParser = require('body-parser');
const apiRoutes = require('./routes/api');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Servir les dossiers statiques
// Le dossier public contiendra notre interface frontend
app.use(express.static(path.join(__dirname, '../public')));
// Le dossier outputs contiendra les PDFs générés
app.use('/downloads', express.static(path.join(__dirname, '../outputs')));

// Routes API
app.use('/api', apiRoutes);

app.listen(PORT, () => {
    console.log(`[Server] L'API de transcription vidéo démarre sur le port ${PORT}`);
});
