const mysql = require('mysql');

var pool = mysql.createPool({
    connectionLimit: 10,
    host: "10.194.69.15",
    user: "A7",
    password: "vV3TtCoonciqOJOb",
    database: "A7",
    dateStrings: true,
    supportBigNumbers: true/*,
    multipleStatements: true*/
});

pool.getConnection((function (err, connection) {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('Database connection was closed.')
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('Database has too many connections.')
        }
        if (err.code === 'ECONNREFUSED') {
            console.error('Database connection was refused.')
        }
    }

    if (connection) {
        console.log("Database connection has been accepted");
        connection.release()
    }
}));

module.exports = pool;
