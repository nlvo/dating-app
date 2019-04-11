// db
var mongo = require('mongodb');
require('dotenv').config();

var db = null,
	dbName = process.env.DB_NAME,
	url = process.env.DB_URL;

// connect to database
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
