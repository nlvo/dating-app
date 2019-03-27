var express = require('express'),
	app = express(),
	port = 3000,
	session = require('express-session'),

	// form
	bodyParser = require('body-parser'),
	multer = require('multer'),
	upload = multer({
		dest: 'public/uploads/'
	}),

	// db
	mongo = require('mongodb');
	require('dotenv').config();

var db = null,
	dbName = process.env.DB_NAME,
	dbHost = process.env.DB_HOST,
	dbPort = process.env.DB_PORT,
	url = 'mongodb://' + dbHost + ':' + dbPort;


// connect to database (local)
mongo.MongoClient.connect(url, { useNewUrlParser: true }, function (err, client) {
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

	// get request
	.get('/', home)

	.get('/login', loginForm)
	.get('/logout', logout)
	.get('/account/:id', profile)
	.get('/register', registerForm)

	// post requests
	.post('/account', upload.single('avatar'), createProfile)
	.post('/login', login)

	// put/update
	.post('/:id/like', likeProfile)

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

function loginForm(req, res) {
	res.render('login.ejs');
}

function registerForm(req, res) {
	res.render('register.ejs');
}

function profile(req, res) {
	var id = req.params.id; //checks params /profile/:id, pass params id

	//find the correct profile by id
	db.collection('user').findOne({  
		_id: mongo.ObjectID(id)
	}, done);

	function done(err, user) {
		if (err) {
			next(err);
		} else {
			res.render('account.ejs', {
				user: user
			});
		}
	}
}

function login(req, res, next){
	var name = req.body.name,
		password = req.body.password;

	// Check if user exist or not
	db.collection('user').findOne({  
		name: name,
		password: password
	}, done);
	
	// https://stackoverflow.com/questions/44687044/node-js-check-if-user-exists

	function done(err, user) {
		if (err) {
			next(err);
		} else if (user) {
			req.session.user = {
				name : user.name // pass name value inside object to session.user
			};
			res.redirect('/account/' + user._id);
		}
		else {
			res.send('not found')
		}
	}
}

function logout(req, res, next) {
	req.session.destroy(function (err){ //destroy the session
		if (err) {
			next(err);
		} else {
			res.redirect('/');
		}
	});
}

// form to create a profile
function createProfile(req, res, next) {
	db.collection('user').insertOne({
		name: req.body.name,
		age: req.body.age,
		gender: req.body.gender,
		email: req.body.email,
		password: req.body.password,
		description: req.body.description,
		avatar: req.file ? req.file.filename : null,
		images: [],
		fave_series: [],
		likes: [],
		superlikes: []
	}, done);

	// input[name="username"]
	// req.body.username ^
	// form ...
	// req.body ^

	function done(err, user) {
		if (err) {
			next(err);
		} else {
			res.redirect('/account/' + user.insertedId);
		}
	}

	console.log(req.file);

}

function likeProfile(req, res, next) {
	var id = req.params.id;
	db.collection('user').updateOne({
		_id: mongo.ObjectID(id)
	}, {
		$set: {
			likes: [
				{
					user_id: req.session.user.id,
					liked: req.body.like
				}
			]
		},
	}, {
		upsert: true
	},done);

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