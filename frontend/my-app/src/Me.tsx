/* eslint-disable jsx-a11y/img-redundant-alt */
import axios from "axios"
import { useEffect, useState } from "react"

function Me() {

    const [me, setMe] = useState(false)

    const [country, setCountry] = useState()     // String
    const [name, setName] = useState()           // String
    const [followers, setFollowers] = useState() // Integer
    
    const [imageUrl, setImageUrl] = useState()   // String
    const [height, setHeight] = useState()       // Integer
    const [width, setWidth] = useState()         // Integer



    const getMe = () => {
        axios.get('/me').then(res => {
            setMe(true)

            const data = res.data
            setCountry(data['country'])
            setName(data['display_name'])
            setFollowers(data['followers']['total'])
            
            setImageUrl(data['images'][0]['url'])
            setHeight(data['images'][0]['height'])
            setWidth(data['images'][0]['width'])
        }).catch(err => {
            console.error('[ERROR] Could not get "/me"')
        })
    }

    useEffect(() => {
        getMe()
    }, [])

    return (
        me ?
        
        <div className="me">
            <img src={imageUrl} width={width} height={height} alt="Profile picture of user" />
            <p>{name} from {country} has {followers} followers</p>
        </div>

        :

        <p>Could not get me.</p>
    )
}

export default Me