const { Pool } = require('pg')
import dotenv from 'dotenv';
dotenv.config();




const connection_string = process.env.CONNECTION_URI;
const pool = new Pool({
    connectionString: connection_string,
    ssl: {
        rejectUnauthorized: false
      }
})

pool.connect((err:Error) => {
    if (err) {
      return console.error('Error acquiring client', err.stack)
    }
    else
    {
        console.log("Succesfully Connected To PostgreSQL!");
    }

})

module.exports = pool