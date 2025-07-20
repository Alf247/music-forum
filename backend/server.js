// BACKEND
const express = require('express')
const cors = require('cors')
const session = require('express-session')
const app = express()
const port = process.env.PORT || 8080

// CORS configuration - IMPORTANT: Must come before session
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001', 'https://music-forum.onrender.com'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use(express.json())

// Session middleware - FIXED configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // Set to true only if using HTTPS everywhere
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        sameSite: 'lax' // Important for cross-origin requests
    },
    name: 'sessionId' // Custom session name
}))

// SPOTIFY API
const SpotifyWebApi = require('spotify-web-api-node')
const redirect = process.env.REDIRECT || 'https://localhost:8080/callback'

const getSpotifyApi = (session) => {
    console.log('Creating fresh Spotify API instance')
    
    const spotifyApi = new SpotifyWebApi({
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        redirectUri: redirect
    });
    
    // If we have stored tokens, set them on the fresh instance
    if (session.accessToken) {
        console.log('Setting stored access token')
        spotifyApi.setAccessToken(session.accessToken);
    }
    
    if (session.refreshToken) {
        console.log('Setting stored refresh token')
        spotifyApi.setRefreshToken(session.refreshToken);
    }
    
    return spotifyApi;
}

// Updated middleware to check authentication
const requireAuth = (req, res, next) => {
    if (!req.session.accessToken) {
        return res.status(401).json({ error: 'Not authenticated' });
    }
    
    // Create fresh API instance with stored tokens
    req.spotifyApi = getSpotifyApi(req.session);
    next();
}

// DATABASE
const pool = require('./database/database.js')
const query = require('./database/query.js')
const initializeFromSQL = require('./database/init.js')

const startServer = async() => {
    try {

        // Add this at the very beginning of your server startup
        console.log('=== ENVIRONMENT CHECK ===')
        console.log('CLIENT_ID:', process.env.CLIENT_ID ? 'SET' : 'MISSING')
        console.log('CLIENT_SECRET:', process.env.CLIENT_SECRET ? 'SET' : 'MISSING')
        console.log('SESSION_SECRET:', process.env.SESSION_SECRET ? 'SET' : 'MISSING')
        console.log('REDIRECT:', process.env.REDIRECT || 'using default')
        console.log('NODE_ENV:', process.env.NODE_ENV)
        console.log('========================')

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
        
        app.post('/submit', requireAuth, (req, res) => {
            console.log('/submit HIT')
            const { album, reviewText, rating } = req.body
    
            req.spotifyApi.getMe().then(data => {
                const me = data.body.id
                console.log('User submitting review:', me)

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
        // Updated isauth endpoint
        app.get('/isauth', (req, res) => {
            console.log('GET /isauth hit');
            const authenticated = !!req.session.accessToken;
            console.log('User authenticated:', authenticated);
            res.json({ authenticated })
        })
        
        app.get('/auth', (req, res) => {
            const spotifyApi = new SpotifyWebApi({
                clientId: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET,
                redirectUri: redirect
            });
            
            const scopes = [
                'user-read-private'
            ]
            
            // Generate a state parameter for security (optional for now)
            const state = Math.random().toString(36).substring(2, 15);
            req.session.authState = state;
            
            res.json({ 
                authUrl: spotifyApi.createAuthorizeURL(scopes, state, false) 
            })
        })
        
        app.get('/callback', (req, res) => {
            console.log('=== CALLBACK DEBUG ===')
            console.log('Query params:', req.query)
            console.log('Session exists:', !!req.session)
            console.log('Session ID:', req.sessionID)
            
            const error = req.query.error
            const code = req.query.code
            const state = req.query.state
            
            if (!code) {
                console.error('No authorization code received.')
                return res.status(400).send('Authorization code is missing.')
            }
            
            if (error) {
                console.error('OAuth error:', error)
                return res.status(400).send(`OAuth error: ${error}`)
            }
            
            try {
                console.log('Creating fresh Spotify API instance for callback...')
                const spotifyApi = new SpotifyWebApi({
                    clientId: process.env.CLIENT_ID,
                    clientSecret: process.env.CLIENT_SECRET,
                    redirectUri: redirect
                });
                
                console.log('Starting token exchange...')
                spotifyApi.authorizationCodeGrant(code)
                    .then(data => {
                        console.log('Token exchange successful!')
                        const accessToken = data.body['access_token']
                        const refreshToken = data.body['refresh_token']
                        const expiresIn = data.body['expires_in']
                        
                        console.log('Storing tokens in session...')
                        // Store tokens in session (not the API instance)
                        req.session.accessToken = accessToken;
                        req.session.refreshToken = refreshToken;
                        req.session.tokenExpiry = Date.now() + (expiresIn * 1000);
                        
                        console.log('Saving session...')
                        req.session.save((err) => {
                            if (err) {
                                console.error('Session save error:', err)
                                return res.status(500).send('Session save failed: ' + err.message)
                            }
                            
                            console.log('Session saved successfully, redirecting...')
                            res.redirect('https://music-forum.onrender.com/')
                        })
                    })
                    .catch(err => {
                        console.error('Token exchange error:', err)
                        res.status(500).send(`Token exchange failed: ${err.message}`)
                    })
            } catch (err) {
                console.error('Callback error:', err)
                res.status(500).send(`Callback error: ${err.message}`)
            }
        })

        // Token refresh middleware/endpoint
        app.get('/refresh-token', (req, res) => {
            const spotifyApi = getSpotifyApi(req.session);
            const refreshToken = spotifyApi.getRefreshToken();
            
            if (!refreshToken) {
                return res.status(401).json({ error: 'No refresh token available' });
            }
            
            spotifyApi.refreshAccessToken().then(data => {
                const accessToken = data.body['access_token'];
                const expiresIn = data.body['expires_in'];
                
                spotifyApi.setAccessToken(accessToken);
                req.session.tokenExpiry = Date.now() + (expiresIn * 1000);
                
                res.json({ success: true, expiresIn });
            }).catch(err => {
                console.error('Error refreshing token:', err);
                res.status(401).json({ error: 'Token refresh failed' });
            });
        });

        // GET SPOTIFY - Updated to use user-specific tokens
        app.get('/me', requireAuth, (req, res) => {
            req.spotifyApi.getMe().then(data => {
                console.log('[SEND] Information about authenticated user')
                res.send(data.body)
            }).catch(err => {
                console.error('Error getting "me": ' + err)
                res.status(401).json({ error: 'Failed to get user info' })
            })
        })

        app.get('/user', requireAuth, (req, res) => {
            const id = req.query.id || req.body.id
            if (!id) {
                return res.status(400).json({ error: 'User ID required' })
            }
            
            req.spotifyApi.getUser(id).then(data => {
                console.log('Got user: ', id)
                res.send(data.body)
            }).catch(err => {
                console.error('Error getting user: ', err)
                res.status(401).send()
            })
        })
        
        // Uses album id to search
        app.get('/album', requireAuth, (req, res) => {
            const id = req.query.album_id
            if (!id) {
                return res.status(400).json({ error: 'Album ID required' })
            }
            
            req.spotifyApi.getAlbum(id).then(data => {
                console.log('/album was successful')
                res.send(data.body)
            }).catch(err => {
                console.error('Error getting /album: ', err)
                res.status(401).json({ error: 'Failed to get album' })
            })
        })
        
        // Uses album name to search
        app.get('/albums', requireAuth, (req, res) => {
            const album = req.query.album
            if (!album) {
                return res.status(400).json({ error: 'Album name required' })
            }
            
            req.spotifyApi.searchAlbums(album, {limit: 10, offset: 0}).then(data => {
                res.send(data.body)
            }).catch(err => {
                console.error('Error getting albums: ', err)
                res.status(500).json({ error: 'Search failed' })
            })
        })
    
        app.listen(port, () => {
            console.log("Multi-user server started on port", port)
        })
    } catch (error) {
        console.error('Failed to start server: ', error)
        process.exit(1)
    }
}

startServer()