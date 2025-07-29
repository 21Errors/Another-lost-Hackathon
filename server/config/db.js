const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'sql7.freesqldatabase.com',
  user: 'sql7792361',        // XAMPP MySQL user
  database: 'sql7792361',
  password: 'vmURWUAyDc',        // If no password
  port: 3306,          // If you configured XAMPP MySQL to use this port
});

module.exports = pool;
