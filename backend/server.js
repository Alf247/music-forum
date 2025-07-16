const express = require('express')
const cors = require('cors')
const app = express()

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}))
//const https = require('https')
//const router = app.router

const port = process.env.PORT || 8080
const redirect = process.env.REDIRECT || 'https://localhost:8080/callback'

const SpotifyWebApi = require('spotify-web-api-node')
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    redirectUri: redirect
});


app.get('/', (req, res) => {
    
    res.send("This is the response from the server.")
    
    /* const accessToken = req.cookies[MY_ACCESS_TOKEN]
    if (!accessToken) {

    } */
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

        console.log('ACCESS TOKEN GET METHOD RETURNED: ' + spotifyApi.getAccessToken())

        //res.redirect(`../?access_token=${accessToken}&refresh_token=${refreshToken}`); // FIX THIS
        res.redirect('localhost:3000/')
    })
});

app.listen(port, () => {
    console.log("Server started!")
})