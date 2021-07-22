const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Ryma1738!',
    database: 'employee_tracker'
});

module.exports = db;