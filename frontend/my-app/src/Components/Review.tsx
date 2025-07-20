import axios from "axios"
import { useEffect, useState } from "react"
import './Review.css'

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

    const [userLoaded, setUserLoaded] = useState(false)
    const [albumLoaded, setAlbumLoaded] = useState(false)

    useEffect(() => {
        // Get user
        if (review) {
            axios.get('/user', { withCredentials: true, params: { user_id: user_id } }).then(res => {
                setUser(res.data)
                console.log('Got user information.')
                setUserLoaded(true)
            }).catch(err => {
                console.error('Error getting /user: ', err)
            })
    
            // Get album
            axios.get('/album', { withCredentials: true, params: { album_id: album_id } }).then(res => {
                setAlbum(res.data)
                console.log('Got album: ', res.data)
                setAlbumLoaded(true)
            }).catch(err => {
                console.log('Error getting album: ', err)
            })
        }
    }, [])

    return (
        (userLoaded && albumLoaded) ? 
        <div className="review">
            <a href={album['external_urls']['spotify']}>
                <img className="album-cover" src={album['images']['0']['url']} alt="Cover of album" />
            </a>
            <div className="two-thirds">
                <div className="review-body">
                    <h2 className="album-title">{album['name']}</h2>
                    <span className="album-subtitle">({(album['release_date'] as string).slice(0,4) ?? 'N/A'}) by {album['artists'][0]['name']}</span>
                    <p className="date">{created_at}</p>
                    <h3 className="review-rating">{rating}</h3>
                    <p className="review-text">{reviewText}</p>
                    <button>Edit</button>
                </div>
            </div>
        </div>

        :
        <></>
    )
}

export default Review