const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

/**
 * Prend un texte et génère un fichier PDF
 * @param {string} text - Le texte transcrit à mettre dans le PDF
 * @param {string} videoUrl - L'URL d'origine (optionnel pour l'en-tête)
 * @returns {Promise<string>} - Une promesse qui résout avec le chemin du fichier PDF.
 */
const generatePDF = (text, videoUrl = '') => {
  return new Promise((resolve, reject) => {
    try {
      const outputDir = path.join(__dirname, '../../outputs');
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      const fileId = crypto.randomBytes(16).toString('hex');
      const pdfPath = path.join(outputDir, `${fileId}.pdf`);

      const doc = new PDFDocument({ margin: 50 });
      const stream = fs.createWriteStream(pdfPath);
      doc.pipe(stream);

      // Titre
      doc.fontSize(20).text('Transcription Vidéo', { align: 'center' });
      doc.moveDown(1);

      // L'URL ou méta-données
      if (videoUrl) {
        doc.fontSize(10).fillColor('blue')
           .text(`Source : ${videoUrl}`, { link: videoUrl, underline: true })
           .fillColor('black');
        doc.moveDown(2);
      }

      // Le texte
      doc.fontSize(12).text(text, { align: 'justify' });

      doc.end();

      stream.on('finish', () => {
        console.log(`[pdfGenerator] PDF généré avec succès: ${pdfPath}`);
        resolve(pdfPath);
      });
      
      stream.on('error', (err) => {
        console.error(`[pdfGenerator] Erreur lors de l'écriture en stream:`, err);
        reject(err);
      });

    } catch (error) {
      console.error(`[pdfGenerator] Erreur lors de la génération PDF: ${error.message}`);
      reject(error);
    }
  });
};

module.exports = { generatePDF };
