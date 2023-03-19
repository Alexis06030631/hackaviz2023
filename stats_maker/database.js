const mariadb = require('mariadb');

const conn = mariadb.createConnection({
	host: 'TODO',
	user: 'TODO',
	password: 'TODO',
	database: 'TODO',
})

module.exports = conn;