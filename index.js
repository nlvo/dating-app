var express = require('express'),
	app = express(),
	port = 3000,
	session = require('express-session'),

	// form
	bodyParser = require('body-parser'),
	methodOverride = require('method-override'),

	// db
	mongo = require('mongodb');
	require('dotenv').config();

var db = null,
	dbName = process.env.DB_NAME,
	url = process.env.DB_URL;

var auth = require('./routes/auth');
var web = require('./routes/web');

// connect to database (local)
mongo.MongoClient.connect(url, {
	useNewUrlParser: true
}, function (err, client) {
	if (err) {
		throw err
	} else {
		db = client.db(dbName);
	}
});

app
	.set('view engine', 'ejs')

	.use(express.static(__dirname + '/public'))
	.use(express.static(__dirname + '/uploads'))
	.use(bodyParser.urlencoded({
		extended: true
	}))
	.use(session({
		secret: 'secret',
		resave: false,
		saveUninitialized: true
	}))
	.use(methodOverride('_method'))
	.use(auth)
	.use(web)

	.use(notFound)

	.listen(port, listening);

// error
function notFound(req, res, next) {
	res.status(404).send('not found 404')
}

function listening() {
	console.log('Listening on port: ' + port);
}