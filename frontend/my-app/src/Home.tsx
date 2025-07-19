import axios from "axios";
import { useEffect, useState } from "react";
import Me from "./Me";
import Auth from "./components/Auth";
import Header from "./components/Header";
import Review from "./components/Review";


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
                <Me></Me>
                <br />
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum unde dolores odit vitae alias vel laudantium similique in aspernatur magni aliquam distinctio id quod maxime neque aliquid, repellat nemo sint? Lorem ipsum dolor sit, amet consectetur adipisicing elit. Rerum saepe hic fugit vero, non unde voluptatum placeat earum deserunt eius inventore quia dignissimos sed ratione at corrupti alias repellat quaerat.
                <br /><br />
            </>

        :
        
        <Auth/>
    )
}

export default Home