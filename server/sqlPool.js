const mysql = require('mysql2');


const pool = mysql.createPool({
  connectionLimit: 1000,
  host: "127.0.0.1",
  user: "root",
  database: "dictionary",
  password: ""
});

module.exports = {
  pool,
}
