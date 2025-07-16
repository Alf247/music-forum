function CreateReview() {
    
    
    return (
        <form className="create-review" action="" method="post">
            <input className="review-text" type="text" />
            <input className="review-rating" min="1" max="10" type="number" />
        </form>
    )
}

export default CreateReview