var express = require('express'),
	bodyParser = require('body-parser'),
	slug = require('slug'),
	find = require('array-find'),
	app = express(),
	port = 3000,
	persons = [{
		id: 'jane-doe',
		name: 'Jane Doe',
		description: 'Photographer',
		series: [
			'suits',
			'nikita'
		]
	}, {
		id: 'john-doe',
		name: 'John Doe',
		description: 'Artist',
		series: [
			'suits'
		]
	}];

app
	.set('view engine', 'ejs')

	.use(express.static(__dirname + '/public'))
	.use(bodyParser.urlencoded({
		extended: true
	}))

	// get request
	.get('/', home)

	.get('/login', login)
	.get('/profile/:id', profile)
	.get('/register', form)

	// post requests
	.post('/profile/', add)

	.use(notFound)

	.listen(port, listening);

// pages
function home(req, res) {
	res.render('index.ejs', {
		persons: persons
	});
}

function login(req, res) {
	res.render('login.ejs');
}

function profile(req, res) {
	var id = req.params.id,
		person = find(persons, function (value) { //find correct profile
			return value.id === id;
		});
	res.render('profile.ejs', {person: person});
}

function form(req, res) {
	res.render('register.ejs');
}

// form
function add(req, res) {
	var id = slug(req.body.id).toLowerCase(); //cleans up the path/slug

	// input[name="username"]
	// req.body.username ^
	// form ...
	// req.body ^

	// push form data in an object
	persons.push({
		id: id,
		name: req.body.name,
		description: req.body.description
	});

	res.redirect('/profile/' + id);
}

// error
function notFound(req, res, next) {
	res.status(404).send('not found 404')
}

function listening() {
	console.log('Listening on port: ' + port);
}