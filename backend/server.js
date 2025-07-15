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

app.get('/auth', (req, res) => {
    const scopes = [
        'user-read-private'
    ]

    res.send(spotifyApi.createAuthorizeURL(scopes, "", true))
})

app.get('/callback', (req, res) => {
    console.log(req.query)
    const error = req.query.error;
    const code = req.query.code;
    const state = req.query.state;

    if (!code) {
        console.error('No authorization code received.');
        return res.status(400).send('Authorization code is missing.');
    }    

    if (error) {
        console.error('Error when getting callback: ', error);
        res.send(`Error when getting callback: ${error}`)       // Preventes end-point from constantly waiting
        return;
    }

    spotifyApi.authorizationCodeGrant(code).then(data => {
        const accessToken = data.body['access_token'];
        const refreshToken = data.body['refresh_token'];
        const expiresIn = data.body['expires_in'];

        spotifyApi.setAccessToken(accessToken);
        spotifyApi.setRefreshToken(refreshToken);

        console.log(accessToken + "\n\n" + refreshToken);
        //res.redirect(`../dashboard/?access_token=${accessToken}&refresh_token=${refreshToken}`);

        setInterval(spotifyApi.refreshAccessToken().then(data => {
            console.log('The access token has been refreshed!');
            spotifyApi.setAccessToken(data.body['access_token']);
        }).catch(error => {
            console.log('Could not refresh access token: ', error);
        }), expiresIn / 2*1000);
    }).catch(error => {
        console.error('\nError authorizationCodeGrant: ', error);
        res.send('Error getting token.')
    })
});

app.listen(port, () => {
    console.log("Server started!")
})