/* eslint-disable jsx-a11y/img-redundant-alt */
import axios from "axios"
import { useEffect, useState } from "react"

function Me() {

    const [me, setMe] = useState()

    const getMe = () => {
        axios.get('/me', { withCredentials: true }).then(res => {
            setMe(res.data)            
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
            <img src={me['images'][0]['url']} width={me['images'][0]['width']} height={me['images'][0]['height']} alt="Profile picture of user" />
            <p>{me['display_name']} from {me['country']} has {me['followers']['total']} {me === 1 ? 'followers' : 'follower'}</p>
        </div>

        :

        <p>Could not get me.</p>
    )
}

export default Me