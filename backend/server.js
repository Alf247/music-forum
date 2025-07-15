const express = require('express')
const app = express()
const https = require('https')
const router = app.router
const SpotifyWebApi = require('spotify-web-api-node')

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    redirectUri: 'https://music-forum.onrender.com/callback'
});

const MY_ACCESS_TOKEN = 'MY_ACCESS_TOKEN';

app.get('/', (req, res) => {
    const accessToken = req.cookies[MY_ACCESS_TOKEN]
    if (!accessToken) {

    }
})

const server = https.createServer(app)

server.listen()