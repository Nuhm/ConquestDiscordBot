const mysql = require('mysql2/promise');

const pool = mysql.createPool({
   host: '213.239.212.247',
   user: 'root',
   password: '123Cheese',
   database: 'unturned_sr',
});

module.exports = pool;
