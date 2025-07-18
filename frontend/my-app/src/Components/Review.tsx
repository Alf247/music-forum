import { useEffect, useState } from "react"

function Review(reviewId: string) {

    const [user, setUser] = useState()
    const [review, setReview] = useState()

    useEffect(() => {
        // Get me
        // Get review
    }, [])

    return (
        <div className="review">
            <img src="ALBUM COVER" alt="" />
            <div className="review-body">
                <h1 className="album-title">PLACEHOLDER</h1>
                <time dateTime="">PLACEHOLDER</time>
                <p className="review-rating">PLACEHOLDER</p>
                <p className="review-text">PLACEHOLDER</p>
                <button>Edit</button>

            </div>
        </div>
    )
}

export default Review