import { useEffect, useState } from "react"
import axios from "axios"
import './Auth.css'

function Auth() {
    
    const [link, setLink] = useState()

    const getLink = () => {
        axios.get("/auth").then(res => {
            setLink(res.data)
            console.log('Got authentication link.')
        }).catch(err => {
            console.error(`Error getting auth: ${err}`)
        })
    }

    useEffect(() => {
        getLink()
    }, [])

    return (
        <div className="flex-container-vertical">
            {link ? 
            <a className="spotify-link" href={link}>Click here to log into Spotify.</a>
            :
            <p>Loading...</p>}
        </div>
    )
}

export default Auth