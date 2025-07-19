const fs = require('fs')
const path = require('path')
const pool = require('./database')

const initializeFromSQL = async () => {
    try {
        const schema = await fs.readFile(
            path.join(__dirname, './schema.sql'),
            'utf8'
        )

        await pool.query(schema)
        console.log('Database schema initialized.')
    } catch (error) {
        console.error('Failed to initialize SQL schema: ', error)
        throw error
    }
}

module.exports = initializeFromSQL