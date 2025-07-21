const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'sql8.freesqldatabase.com',
  user: 'sql8790900',        // XAMPP MySQL user
  database: 'sql8790900',
  password: 'FcHhystuDU',        // If no password
  port: 3306,          // If you configured XAMPP MySQL to use this port
});

module.exports = pool;
