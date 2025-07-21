CREATE TABLE IF NOT EXISTS reviews (
    id SERIAL PRIMARY KEY,
    user_id TEXT NOT NULL,
    album TEXT NOT NULL,
    rating INTEGER,
    review TEXT,
    created_at TIMESTAMP DEFAULT CONVERT_TZ(NOW(), 'UTC', 'Europe/Oslo')
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_album ON reviews(album);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);

--INSERT INTO reviews (user_id, album, rating, review) VALUES
--    ('user1', 'Abbey Road', 3, 'Its gr8 m8')
--ON CONFLICT DO NOTHING;