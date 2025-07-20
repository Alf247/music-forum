export const everything = 'SELECT * FROM reviews ORDER BY created_at DESC;'

export const submitReview = 'INSERT INTO reviews (user_id, album, review, rating) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING;'