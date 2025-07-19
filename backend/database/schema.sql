CREATE TABLE IF NOT EXISTS reviews (
    id SERIAL PRIMARY KEY,
    user_id TEXT NOT NULL,
    album TEXT NOT NULL,
    rating INTEGER,
    review TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);