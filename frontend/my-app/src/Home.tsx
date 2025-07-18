import axios from "axios";
import { useEffect, useState } from "react";
import Me from "./Me";
import Auth from "./components/Auth";
import Header from "./components/Header";


function Home() {

    const [serverResponse, setRes] = useState('')
    const [authorized, setAuthorized] = useState(false)

    useEffect(() => {
        checkAuthorization()
    }, [])

    const checkAuthorization = async () => {
        axios.get('/isauth').then(res => {
            setAuthorized(res.data)
        }).catch(err => {
            console.error('Error getting /isauth: ' + err)
        })
    }

    const getResponse = async () => {
        axios.get('/').then(res => {
            setRes(res.data)
        }).catch(err => {
            console.log(err)
        })
    }

    return (
        authorized ?
            <>
                <Header/>
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