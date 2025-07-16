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
            <button onClick={getResponse}>Test server</button>
            <p>{serverResponse}</p>
        </>
    )
}

export default Home