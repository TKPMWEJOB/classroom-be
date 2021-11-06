const mysql = require('mysql');

const db_config = {
    host: process.env.DB_URI,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
};

const pool = mysql.createPool(db_config)

module.exports = pool;