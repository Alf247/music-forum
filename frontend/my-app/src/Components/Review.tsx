import axios from "axios"
import { useEffect, useState } from "react"

interface ReviewI {
    user_id: string,
    album_id: string,
    rating: number,
    reviewText: string,
    created_at: string
}

function Review(review: ReviewI) {

    const {user_id, album_id, rating, reviewText, created_at} = review

    const [user, setUser] = useState<any>(null)
    const [album, setAlbum] = useState<any>(null)

    useEffect(() => {
        // Get user
        axios.get('/user', { params: { user_id: user_id } }).then(res => {
            setUser(res.data)
            console.log('Got user information.')
        }).catch(err => {
            console.error('Error getting /user: ', err)
        })

        // Get album
        axios.get('/album', { params: { album_id: album_id } }).then(res => {
            setAlbum(res.data)
            console.log('Got album: ', album)
        }).catch(err => {
            console.log('Error getting album: ', err)
        })
    }, [album, album_id, review.user_id, user_id])

    return (
        <div className="review">
            <img src="ALBUM COVER" alt="Cover of album" />
            <div className="review-body">
                <h1 className="album-title">{album}</h1>
                <p className="date">{created_at}</p>
                <p className="review-rating">{rating}</p>
                <p className="review-text">{reviewText}</p>
                <button>Edit</button>

            </div>
        </div>
    )
}

export default Review