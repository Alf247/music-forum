const express = require('express')
const cors = require('cors')
const app = express()

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}))
//const https = require('https')
//const router = app.router
const SpotifyWebApi = require('spotify-web-api-node')

const port = process.env.PORT || 8080

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    redirectUri: 'https://music-forum.onrender.com/callback'
});

const MY_ACCESS_TOKEN = 'MY_ACCESS_TOKEN';

app.get('/', (req, res) => {
    
    res.send("This is the response from the server.")
    
    /* const accessToken = req.cookies[MY_ACCESS_TOKEN]
    if (!accessToken) {

    } */
})

app.listen(port, () => {
    console.log("Server started!")
})