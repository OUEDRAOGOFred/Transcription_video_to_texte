const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool(process.env.DATABASE_URL);

// Test de connexion à la base de données
pool.getConnection()
  .then(connection => {
    console.log('[DB] Connecté à la base de données MySQL.');
    connection.release();
  })
  .catch(err => {
    console.error('[DB] Erreur de connexion à MySQL:', err.message);
  });

module.exports = {
  /**
   * Exécute une requête SQL pure
   * @param {string} text - La requête SQL
   * @param {Array} params - Les paramètres de la requête
   */
  query: (text, params) => pool.execute(text, params),
};
