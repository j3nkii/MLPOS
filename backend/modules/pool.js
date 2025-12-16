const pg = require('pg');
require('dotenv').config(); 
const configProd = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: {
    rejectUnauthorized: false  // Required for RDS
  }
};
const configDev = {
    host: 'localhost',
    port: 5432,
    database: process.env.DB_NAME,
    max: 10,
    idleTimeoutMillis: 30000,
};
const config = process.env.NODE_ENV === "production" ? configProd : configDev;
const pool = new pg.Pool(config);
pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});
module.exports = pool;