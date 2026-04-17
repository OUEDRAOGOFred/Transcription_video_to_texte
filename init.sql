-- Création de la table 'transcriptions' dans ta base de données locale (transcription_db)
CREATE TABLE IF NOT EXISTS transcriptions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    video_url TEXT NOT NULL,
    transcript_text TEXT NOT NULL,
    pdf_path TEXT,
    status VARCHAR(50) DEFAULT 'PENDING',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
