const pg = require('pg');
require('dotenv').config(); 

const config = {
    host: 'localhost',
    port: 5432,
    database: process.env.DB_NAME,
    max: 10,
    idleTimeoutMillis: 30000,
};
const pool = new pg.Pool(config);
pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});


module.exports = pool;