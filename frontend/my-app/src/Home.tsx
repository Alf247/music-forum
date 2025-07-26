import axios from "axios";
import { useEffect, useState } from "react";
import Auth from "./components/Auth";
import Header from "./components/Header";
import Review from "./components/Review";
import "./Home.css"


function Home() {

    const [reviews, setReviews] = useState([])
    const [authorized, setAuthorized] = useState(false)

    useEffect(() => {
        checkAuthorization()
        getReviews()
    }, [])

    const checkAuthorization = () => {
        axios.get('/isauth').then(res => {
            setAuthorized(res.data)
        }).catch(err => {
            console.error('Error getting /isauth: ' + err)
            setAuthorized(false)
        })
    }

    const getReviews = () => {
        axios.get('/reviews').then(res => {
            setReviews(res.data)
        }).catch(err => {
            console.error('Error getting all reviews: ', err)
        })
    }

    return (
        authorized ?
            <>
                <Header/>
                <div className="main-content">
                    {reviews.map((item, index) => (
                        <Review 
                            key={index}
                            user_id={item['user_id']}
                            album_id={item['album']}
                            rating={item['rating']}
                            reviewText={item['review']}
                            created_at={item['created_at']}
                        />
                    ))}
                </div>
            </>

        :
        
        <Auth/>
    )
}

export default Home