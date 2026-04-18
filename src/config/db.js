const { Pool } = require('pg');
require('dotenv').config();

// Configuration spécifique pour se connecter à Supabase via un réseau IPv4 
// avec le backend pg qui force IPv4 de base pour éviter l'erreur IPv6 (ENETUNREACH)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  },
  // IPv4 support timeout and mode
  options: '-c statement_timeout=30000',
  host: process.env.DATABASE_URL ? new URL(process.env.DATABASE_URL).hostname : ''
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
