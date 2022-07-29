const {Pool} = require('pg');
const config = require('../config.js');

const pool = new Pool({
  host: config.DB_HOST,
  // user: process.env.DB_USER,
  user: config.DB_USER,
  password: config.DB_PASSWORD,
  database: config.DB_NAME,
  port: 5432,
  max: 50,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000
})



module.exports = {
  //adding info to help log
  query: (text, params, callback) => {
    const start = Date.now();
    return pool.query(text, params, (err, res) => {
      const duration = Date.now() - start;
      //logging info about the query
      console.log('executed query', {
        text,
        params,
        duration,
        rows: res.rowCount
      })
      callback(err, res)
    })
  },
  //get a client to execute multiple queries
  getClient: (callback) => {
    pool.connect((err, client, done) => {
      callback(err, client, done)
    })
  }
}