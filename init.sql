-- Création de la table 'transcriptions' dans Supabase (PostgreSQL)
CREATE TABLE IF NOT EXISTS transcriptions (
    id SERIAL PRIMARY KEY,
    video_url TEXT NOT NULL,
    transcript_text TEXT NOT NULL,
    pdf_path TEXT,
    status VARCHAR(50) DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
