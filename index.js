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
	dbHost = process.env.DB_HOST,
	dbPort = process.env.DB_PORT,
	url = 'mongodb://' + dbHost + ':' + dbPort;

var auth = require('./routes/auth');

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
	
	// get request
	.get('/', home)

	// put/update
	.put('/account/:id/like', likeProfile)

	.use(notFound)

	.listen(port, listening);

// pages
function home(req, res, next) {

	db.collection('user').find().toArray(done); //find users in db

	function done(err, user) {
		if (err) {
			next(err);
		} else {
			res.render('index.ejs', {
				user: user,
				user_logged_in: req.session.user
			});
		}
	}
}

function likeProfile(req, res, next) {
	var id = req.params.id;
	db.collection('user').updateOne({
		_id: mongo.ObjectID(id)
	}, {
		$set: {
			likes: [
				mongo.ObjectID(req.session.user.id), //gives the user.id of the liker
			]
		},
	}, {
		upsert: true
	}, done);

	function done(err) {
		if (err) {
			next(err);
		} else {
			res.redirect('/');
		}
	}
}

// error
function notFound(req, res, next) {
	res.status(404).send('not found 404')
}

function listening() {
	console.log('Listening on port: ' + port);
}