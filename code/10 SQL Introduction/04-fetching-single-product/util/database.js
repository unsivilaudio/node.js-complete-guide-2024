const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'max', // REPLACE
    database: 'node-complete',
    password: 'secret', // REPLACE
});

module.exports = pool.promise();
