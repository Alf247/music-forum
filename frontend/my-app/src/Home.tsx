import axios from "axios";
import { useState } from "react";
import Me from "./Me";


function Home() {

    const [serverResponse, setRes] = useState('');

    const getResponse = async () => {
        axios.get('/').then(res => {
        setRes(res.data)
        }).catch(err => {
        console.log(err)
        })
    }

    return (
        <>
            <a href="/auth">Click this to authorize your Spotify account.</a>
            <br />
            <Me></Me>
            <br />
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum unde dolores odit vitae alias vel laudantium similique in aspernatur magni aliquam distinctio id quod maxime neque aliquid, repellat nemo sint? Lorem ipsum dolor sit, amet consectetur adipisicing elit. Rerum saepe hic fugit vero, non unde voluptatum placeat earum deserunt eius inventore quia dignissimos sed ratione at corrupti alias repellat quaerat.
            <br /><br />
            <button onClick={getResponse}>Test server</button>
            <p>{serverResponse}</p>
        </>
    )
}

export default Home