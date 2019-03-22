var express = require('express'),
	app = express(),
	port = 3000,

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
	url = 'mongodb://' + process.env.DB_HOST + ':' + process.env.DB_PORT,

	slug = require('slug'),
	find = require('array-find');


mongo.MongoClient.connect(url, function (err, client) {
	if (err) {
		throw err
	} else {
		db = client.db(process.env.DB_NAME);
	}
});

app
	.set('view engine', 'ejs')

	.use(express.static(__dirname + '/public'))
	.use(express.static(__dirname + '/uploads'))
	.use(bodyParser.urlencoded({
		extended: true
	}))

	// get request
	.get('/', home)

	.get('/login', login)
	.get('/account/:id', profile)
	.get('/register', form)

	// post requests
	.post('/account', upload.single('avatar'), createProfile)

	.use(notFound)

	.listen(port, listening);

// pages
function home(req, res, next) {

	db.collection('users').find().toArray(done); //find users db

	function done(err, users) {
		if (err) {
			next(err);
		} else {
			res.render('index.ejs', {
				users: users
			});
		}
	}
}

function login(req, res) {
	res.render('login.ejs');
}

function form(req, res) {
	res.render('register.ejs');
}

function profile(req, res) {
	var id = req.params.id; //checks params /profile/:id
	db.collection('users').findOne({
		_id: mongo.ObjectID(id)
	}, done);
	// person = find(persons, function (value) { //find correct profile
	// 	return value.id === id;
	// });

	function done(err, users) {
		if (err) {
			next(err);
		} else {
			res.render('account.ejs', {
				users: users
			});
		}
	}
}

// form to create a profile
function createProfile(req, res, next) {
	// var id = slug(req.body.name).toLowerCase(); //cleans up the path/slug
	db.collection('users').insertOne({
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

	// push form data in an object
	// persons.push({
	// 	id: id,
	// 	name: req.body.name,
	// 	avatar: req.file,
	// 	description: req.body.description
	// });

	function done(err, users) {
		if (err) {
			next(err);
		} else {
			res.redirect('/account/' + users.insertedId);
		}
	}

	console.log(req.file);

}

// error
function notFound(req, res, next) {
	res.status(404).send('not found 404')
}

function listening() {
	console.log('Listening on port: ' + port);
}