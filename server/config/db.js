const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: '',
  user: '',        // XAMPP MySQL user
  database: '',
  password: '',        // If no password
  port: 3306,          // If you configured XAMPP MySQL to use this port
});

module.exports = pool;
