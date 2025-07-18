import { useState } from "react"
import SearchAlbum from "./SearchAlbum"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import './CreateReview.css'

interface Review {
    album: string,
    reviewText: string | null,
    rating: number | null
}

function CreateReview() {

    const navigate = useNavigate()
    
    const [selected, setSelected] = useState<Record<string, any>>({})
    const [reviewText, setReviewText] = useState<string | null>(null)
    const [rating, setRating] = useState<number | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {

        e.preventDefault()

        const review: Review = {
            album: selected['id'],
            reviewText: reviewText,
            rating: rating
        }

        console.log(review)

        axios.post('https://music-forum.onrender.com/submit', review, { withCredentials: true }).then(res => {
            console.log(res)
            navigate('/')
        }).catch(err => {
            console.error('Error submitting review: ', err)
            navigate('/')
        })
    }
    
    return (
        selected['id'] ?
        <div className="flex-container-vertical">
            <div>
                <form className="create-review" action="" method="post" onSubmit={handleSubmit}>
                    <img className="album-cover" src={selected['images']['0']['url']} alt="Album cover" />
                    <div className="two-thirds">
                        <div>
                            <h2 className="album-title">{(selected['name'] as string).toUpperCase()}</h2>
                            <span className="album-subtitle">({(selected['release_date'] as string).slice(0,4) ?? 'N/A'}) by {selected['artists'][0]['name']}</span>
                        </div>
                        <br />
                        <input 
                        className="review-rating" 
                        placeholder="1-10"
                        min="1" 
                        max="10" 
                        type="number"
                        onChange={(e) => { 
                            const val = Number(e.target.value)
                            setRating(val) }} />
                        <br />
                        <textarea 
                        className="review-text" 
                        placeholder="Write your review..."
                        spellCheck="false"
                        onChange={(e) => { setReviewText(e.target.value) }} />

                        <br />
                        <div className="buttons">
                            <button className="back" onClick={() => { setSelected({}) }}>BACK</button>
                            <button className="submit-review" type="submit">SAVE</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
        :
        <SearchAlbum setSelect={setSelected} />
    )
}

export default CreateReview