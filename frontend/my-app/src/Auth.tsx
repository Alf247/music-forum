import { useEffect, useState } from "react"
import axios from "axios"
import { href, redirect } from "react-router-dom"

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
        <a href={link}>Click here to log into Spotify.</a>
    )
}

export default Auth