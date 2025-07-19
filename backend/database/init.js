const fs = require('fs').promises
const path = require('path')
const pool = require('./database')

const initializeFromSQL = async () => {
    fs.readFile(path.join(__dirname, './schema.sql'), 'utf8')
        .then(schema => {
            pool.query(schema)
            console.log('Database schema initialized.')
        }).catch(error => {
            console.error('Failed to initialize SQL schema: ', error)
            throw error
        }
    )
        
        /* try {
            const schema = fs.readFile(
                path.join(__dirname, './schema.sql'),
                'utf8'
            )
            
        pool.query(schema)
        console.log('Database schema initialized.')
    } catch (error) {
        console.error('Failed to initialize SQL schema: ', error)
        throw error
    } */
}

module.exports = initializeFromSQL