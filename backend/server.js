// BACKEND
const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 8080

app.use(cors({
    origin: ['http://localhost:3000', 'https://music-forum.onrender.com'],
    credentials: true
}))

app.use(express.json())


// SPOTIFY API
const SpotifyWebApi = require('spotify-web-api-node')
const redirect = process.env.REDIRECT || 'https://localhost:8080/callback'
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    redirectUri: redirect
});


// DATABASE
const pool = require('./database/database.js')
const query = require('./database/query.js')
const initializeFromSQL = require('./database/init.js')


const startServer = async() => {
    try {
    
        await initializeFromSQL()
        
        
        // DATABASE
        app.get('/health', async (req, res) => {
            try {
                const result = await pool.query('SELECT NOW()');
                res.json({ 
                    status: 'healthy', 
                    database: 'connected',
                    timestamp: result.rows[0].now 
                });
            } catch (err) {
                res.status(500).json({ 
                    status: 'error', 
                    database: 'disconnected',
                    error: err.message 
                });
            }
        });

        app.get('/reviews', (req, res) => {
            pool.query(query.everything).then(data => {
                console.log('Got reviews: ', data.rows)
                res.json(data.rows)
            }).catch(err => {
                console.error('Error getting a review: ', err)
                res.status(400).send(err)
            })
        })

        /* app.get('/review', (req, res) => {
            const 
        }) */
        
        app.post('/submit', (req, res) => {
            console.log('/submit HIT')
            const { album, reviewText, rating } = req.body
    
            spotifyApi.getMe().then(data => {
                const me = data.body.id
                console.log(me)

                pool.query(query.submitReview, [me, album, reviewText, rating]).then(_ => {
                    res.status(200).json({ success: true });
                }).catch(err => {
                    console.error('Error submitting review: ', err)
                    res.status(400).send(err)
                })

            }).catch(err => {
                console.error('Error getting me: ', err)
                res.status(400).send(err)
            })



        })
        

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
            res.send(spotifyApi.getAccessToken() ? true : false)
        })
        
        app.get('/auth', (req, res) => {
            const scopes = [
                'user-read-private'
            ]
            
            res.send(spotifyApi.createAuthorizeURL(scopes, "", false))
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
        

        // GET SPOTIFY
        app.get('/me', (req, res) => {
            spotifyApi.getMe().then(data => {
                console.log('[SEND] Information about authenticated user: ' + data)
                res.send(data.body)
            }).catch(err => {
                console.error('Error getting "me": ' + err)
            })
        })

        app.get('/user', (req, res) => {
            const id = req.data
            spotifyApi.getUser(id).then(data => {
                console.log('Got user: ', req.data)
                res.send(data.body)
            }).catch(err => {
                console.error('Error getting user: ', err)
                res.status(401).send()
            })
        })
        
        // Uses album id to search
        app.get('/album', (req, res) => {
            const id = req.body
            spotifyApi.getAlbum(id).then(data => {
                console.log('/album was successful: ', data.body)
                res.send(data.body)
            }).catch(err => {
                console.error('Error getting /album: ', err)
                res.status(401).send('Error getting /album: ', err)
            })
        })
        
        // Uses album name to search
        app.get('/albums', (req, res) => {
            const album = req.query.album
            
            spotifyApi.searchAlbums(album, {limit: 10, offset: 0}).then(data => {
                res.send(data.body)
            }).catch(err => {
                console.error('Error getting albums: ', err)
            })
        })
        
    
        app.listen(port, () => {
            console.log("Server started!")
        })
    } catch (error) {
        console.error('Failed to start server: ', error)
        process.exit(1)
    }
}


startServer()
