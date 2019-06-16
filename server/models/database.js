const mysql = require('mysql');

var pool = mysql.createPool({
	connectionLimit: 10,
	host: process.env.DB_HOST || 'localhost',
	user: process.env.DB_USER || 'root',
	password: process.env.DB_PASSWORD || '',
	database: process.env.DB_DATABASE || 'prpose',
	dateStrings: true,
	supportBigNumbers: true
});

pool.getConnection((err, connection) => {
	if (err) {
		if (err.code === 'PROTOCOL_CONNECTION_LOST') {
			console.error('Database connection was closed.');
		}
		if (err.code === 'ER_CON_COUNT_ERROR') {
			console.error('Database has too many connections.');
		}
		if (err.code === 'ECONNREFUSED') {
			console.error('Database connection was refused.');
		}
	}

	if (connection) {
		console.log('Database connection has been accepted');
		connection.release();
	}
});

module.exports = pool;
