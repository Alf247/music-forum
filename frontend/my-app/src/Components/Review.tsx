import { useState } from "react"

function Review() {

    const [review, setReview] = useState()

    return (
        <div className="review">
            <img src="ALBUM COVER" alt="" />
            <div className="review-body">
                <h1 className="album-title">PLACEHOLDER</h1>
                <time dateTime="">PLACEHOLDER</time>
                <p className="review-rating">PLACEHOLDER</p>
                <p className="review-text">PLACEHOLDER</p>

            </div>
        </div>
    )
}

export default Review