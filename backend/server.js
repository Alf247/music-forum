const express = require('express')
const app = express()
const router = app.router
const SpotifyWebApi = require('spotify-web-api-node')

/* const spotifyApi = new SpotifyWebApi({
    clientId:''
}); */

const MY_ACCESS_TOKEN = 'MY_ACCESS_TOKEN';

app.get('/', (req, res) => {
    const accessToken = req.cookies[MY_ACCESS_TOKEN]
    if (!accessToken) {

    }
})

//app.listen