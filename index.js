var express = require('express'),
	bodyParser = require('body-parser'),
	multer = require('multer'),
	upload = multer({ dest: 'public/uploads/' }),
	slug = require('slug'),
	find = require('array-find'),
	app = express(),
	port = 3000,
	persons = [
		{
			id: 'jane-doe',
			name: 'Jane Doe',
			avatar: '',
			description: 'Photographer',
			series: [
				'suits',
				'nikita'
			]
		}, {
			id: 'john-doe',
			name: 'John Doe',
			avatar: '',
			description: 'Artist',
			series: [
				'suits'
			]
		}
	];

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
	.get('/profile/:id', profile)
	.get('/register', form)

	// post requests
	.post('/profile', upload.single('avatar'), createProfile)

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

function form(req, res) {
	res.render('register.ejs');
}

function profile(req, res) {
	var id = req.params.id, //checks params /profile/:id
		person = find(persons, function (value) { //find correct profile
			return value.id === id;
		});
	res.render('profile.ejs', {persons: person});
}

// form to create a profile
function createProfile(req, res, next) {
	var id = slug(req.body.name).toLowerCase(); //cleans up the path/slug

	// input[name="username"]
	// req.body.username ^
	// form ...
	// req.body ^

	// push form data in an object
	persons.push({
		id: id,
		name: req.body.name,
		avatar: req.file,
		description: req.body.description
	});

	console.log(req.file);

	res.redirect('/profile/' + id);
}

// error
function notFound(req, res, next) {
	res.status(404).send('not found 404')
}

function listening() {
	console.log('Listening on port: ' + port);
}