// BACKEND
const express = require('express')
const session = require('express-session')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 8080

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: process.env.NODE_ENV === 'production', // HTTPS in production
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}))

app.use(cors({
    origin: ['http://localhost:3000', 'https://music-forum.onrender.com'],
    credentials: true
}))

app.use(express.json())


// SPOTIFY API
const SpotifyWebApi = require('spotify-web-api-node')
const redirect = process.env.REDIRECT || 'https://localhost:8080/callback'
/* const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    redirectUri: redirect
}); */

const createSpotifyApi = () => {
    return new SpotifyWebApi({
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        redirectUri: redirect
    })
}

const ensureValidToken = async (req) => {
    try {
        const userTokens =  req.sessions.spotifyTokens

        if (!spotifyApi.getRefreshToken()) {
            console.log('No refresh token available.')
            return false
        }
        
        if (!userTokens || !userTokens.refreshToken) {
            console.log('No refresh token available.')
            return false
        }
        
        const now = Date.now()
        const fiveMinutes = 5 * 60 * 1000
        
        if (!userTokens.expiresAt || now >= (userTokens.expiresAt - fiveMinutes)) {
            console.log('Token expired, refreshing...')

            const spotifyApi = createSpotifyApi()
            spotifyApi.setRefreshToken(userTokens.refreshToken)

            const data = await spotifyApi.refreshAccessToken()
            const accessToken = data.body['access_token']
            const expiresIn = data.body['expires_in']

            req.session.spotifyTokens = {
                accessToken: accessToken,
                refreshToken: userTokens.refreshToken,
                expiresAt: now + (expiresIn * 1000)
            }

            console.log('Token refreshed successfully for user')
            return true
        }
        return true

    } catch (error) {
        console.error('Error refreshing token: ', error)
        return false
    }
}

const requireValidToken = async (req, res, next) => {
    const isValid = await ensureValidToken(req)
    if (!isValid) {
        return res.status(401).json({ error: 'Authentication required!' })
    }
    next()
}

const getUserSpotifyApi = (req) => {
    const spotifyApi = createSpotifyApi()
    const userTokens = req.session.spotifyTokens

    if (userTokens && userTokens.accessToken) {
        spotifyApi.setAccessToken(userTokens.accessToken)
        spotifyApi.setRefreshToken(userTokens.refreshToken)
    }

    return spotifyApi
}


// DATABASE
const pool = require('../backend/modules/database.js')
const query = require('../backend/modules/query.js')



// ROUTES
// AUTHENTICATION
/* app.get('/', (req, res) => {

    // Checks if access token is still valid
    if (!spotifyApi.getAccessToken()) {
        console.log('Access token not found')

    }
    
    res.send("This is the response from the server.")
}) */

app.get('/isauth', (req, res) => {
    console.log('GET /isauth hit');
    const hasToken = req.session.spotifyTokens &&
                     req.session.spotifyTokens.accessToken &&
                     req.session.spotifyTokens.refreshToken

    res.send(hasToken || false)
    //res.send(spotifyApi.getAccessToken() ? true : false)
})

app.get('/auth', (req, res) => {
    const spotifyApi = createSpotifyApi()
    const scopes = ['user-read-private']

    //req.session.authState = Math.random().toString(36).substring(7)

    res.send(spotifyApi.createAuthorizeURL(scopes, '', true))
})

app.get('/callback', (req, res) => {
    console.log(req.query)
    const error = req.query.error
    const code = req.query.code
    /* const state = req.query.state

    // Verify state to prevent CSRF
    if (state !== req.session.authState) {
        return res.status(400).send('Invalid state parameter')
    } */

    if (!code) {
        console.error('No authorization code received.')
        return res.status(400).send('Authorization code is missing.')
    }    

    if (error) {
        console.error('Error when getting callback: ', error)
        res.send(`Error when getting callback: ${error}`)       // Preventes end-point from constantly waiting
        return;
    }

    const spotifyApi = createSpotifyApi()

    spotifyApi.authorizationCodeGrant(code).then(data => {
        const accessToken = data.body['access_token']
        const refreshToken = data.body['refresh_token']
        const expiresIn = data.body['expires_in']

        // Store tokens in user's session
        req.session.spotifyTokens = {
            accessToken: accessToken,
            refreshToken: refreshToken,
            expiresAt: Date.now() + (expiresIn * 1000)
        }

        /* console.log('The token expires in ' + expiresIn)
        console.log('The access token is ' + accessToken)
        console.log('The refresh token is ' + refreshToken)

        spotifyApi.setAccessToken(accessToken)
        spotifyApi.setRefreshToken(refreshToken) */

        res.redirect('http://localhost:3000/')
    }).catch(err => {
        console.error('Error in callback: ', err)
        res.status(500).send('Authentication failed')
    })
});


// GENERAL
app.get('/me', requireValidToken, (req, res) => {
    const spotifyApi = getUserSpotifyApi(req)

    spotifyApi.getMe().then(data => {
        console.log('[SEND] Information about authenticated user: ' + data)
        res.send(data.body)
    }).catch(err => {
        console.error('Error getting "me": ' + err)
        res.status(500).json({ error: 'Failed to get user information' })
    })
})

app.get('/album', (req, res) => {
    res.send('"/album" triggered')
})

app.get('/albums', requireValidToken, (req, res) => {
    const album = req.query.album
    const spotifyApi = getUserSpotifyApi(req)

    spotifyApi.searchAlbums(album, {limit: 10, offset: 0}).then(data => {
        res.send(data.body)
    }).catch(err => {
        console.error('Error getting albums: ', err)
        res.status(500).json({ error: 'Failed to search albums' })
    })
})

app.post('/submit', (req, res) => {
    console.log('/submit HIT')
    console.log(req.body)
    res.status(200).json({ success: true });
})


app.listen(port, () => {
    console.log("Server started!")
})