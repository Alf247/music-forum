import { useState } from "react"
import SearchAlbum from "./SearchAlbum"
import axios from "axios"
import { useNavigate } from "react-router-dom"

interface Review {
    album: string,
    reviewText: string,
    rating: number | null
}

function CreateReview() {

    const navigate = useNavigate()
    
    const [selected, setSelected] = useState('')
    const [reviewText, setReviewText] = useState('')
    const [rating, setRating] = useState<number | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {

        const review: Review = {
            album: selected,
            reviewText: reviewText,
            rating: rating
        }

        console.log(review)

        axios.post('/submit', review).then(res => {
            console.log(res)
            navigate('/')
        }).catch(err => {
            console.error('Error submitting review: ', err)
        })
    }
    
    return (
        selected ?
        <form className="create-review" action="" method="post" onSubmit={handleSubmit}>
            <input 
              className="review-text" 
              placeholder="Write your review..."
              type="text"
              onChange={(e) => { setReviewText(e.target.value) }} />

            <input 
              className="review-rating" 
              placeholder="1-10"
              min="1" 
              max="10" 
              type="number"
              onChange={(e) => { 
                const val = Number(e.target.value)
                setRating(val) }} />

            <button type="submit">Submit</button>
        </form>
        :
        <SearchAlbum setSelect={setSelected} />
    )
}

export default CreateReview