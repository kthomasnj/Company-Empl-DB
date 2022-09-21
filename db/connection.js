const mysql = require('mysql2');

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'TTakesha153_',
        database: 'corporate_db',
        multipleStatements: true,
    },
    console.log(`Connected to the corporate_db database.`)
);

module.exports = db;