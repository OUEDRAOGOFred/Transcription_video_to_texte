const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Test de connexion à la base de données
pool.on('connect', () => {
  console.log('[DB] Connecté à la base de données Supabase (PostgreSQL).');
});

module.exports = {
  /**
   * Exécute une requête SQL pure
   * @param {string} text - La requête SQL
   * @param {Array} params - Les paramètres de la requête
   */
  query: (text, params) => pool.query(text, params),
};
