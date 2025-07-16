import pool from './database.js'

const express = require('express')
const cors = require('cors')
const app = express()

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}))

const port = process.env.PORT || 8080
const redirect = process.env.REDIRECT || 'https://localhost:8080/callback'

const SpotifyWebApi = require('spotify-web-api-node')
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    redirectUri: redirect
});


app.get('/', (req, res) => {

    // Checks if access token is still valid
    if (!spotifyApi.getAccessToken()) {
        console.log('Access token not found')
        res.redirect('http://localhost:3000/auth') // Fix this line

    }
    
    res.send("This is the response from the server.")
})

app.get('/isauth', (req, res) => {
    console.log('GET /isauth hit');
    res.send(spotifyApi.getAccessToken() ? true : false)
})

app.get('/auth', (req, res) => {
    const scopes = [
        'user-read-private'
    ]

    res.send(spotifyApi.createAuthorizeURL(scopes, "", true))
})

app.get('/callback', (req, res) => {
    console.log(req.query)
    const error = req.query.error
    const code = req.query.code
    const state = req.query.state

    if (!code) {
        console.error('No authorization code received.')
        return res.status(400).send('Authorization code is missing.')
    }    

    if (error) {
        console.error('Error when getting callback: ', error)
        res.send(`Error when getting callback: ${error}`)       // Preventes end-point from constantly waiting
        return;
    }

    spotifyApi.authorizationCodeGrant(code).then(data => {
        const accessToken = data.body['access_token']
        const refreshToken = data.body['refresh_token']
        const expiresIn = data.body['expires_in']

        console.log('The token expires in ' + expiresIn)
        console.log('The access token is ' + accessToken)
        console.log('The refresh token is ' + refreshToken)

        spotifyApi.setAccessToken(accessToken)
        spotifyApi.setRefreshToken(refreshToken)

        res.redirect('http://localhost:3000/')
    })
});

app.get('/me', (req, res) => {
    spotifyApi.getMe().then(data => {
        console.log('[SEND] Information about authenticated user: ' + data)
        res.send(data.body)
    }).catch(err => {
        console.error('Error getting "me": ' + err)
    })
})

app.listen(port, () => {
    console.log("Server started!")
})