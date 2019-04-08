// db
var mongo = require('mongodb');
require('dotenv').config();

var db = null,
	dbName = process.env.DB_NAME,
	dbHost = process.env.DB_HOST,
	dbPort = process.env.DB_PORT,
	url = 'mongodb://' + dbHost + ':' + dbPort;

// connect to database (local)
var url = mongo.MongoClient.connect(url, {
	useNewUrlParser: true
}, function (err, client) {
	if (err) {
		throw err
	} else {
		db = client.db(dbName);
	}
});

module.exports = url;
