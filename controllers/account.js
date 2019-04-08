// db
var mongo = require('mongodb');
require('dotenv').config();

var db = null,
	dbName = process.env.DB_NAME,
	dbHost = process.env.DB_HOST,
	dbPort = process.env.DB_PORT,
	url = 'mongodb://' + dbHost + ':' + dbPort;

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

var account = {
	show: function (req, res) {
		var id = req.params.id; //checks params /profile/:id, pass params id

		//find the correct profile by id
		db.collection('user').findOne({
			_id: mongo.ObjectID(id)
		}, done);
		console.log(req.params);

		function done(err, user, next) {
			if (err) {
				next(err);
			} else {
				res.render('account.ejs', {
					user: user
				});

			}
		}

	},
	// form to create a profile
	create: function (req, res, next) {
		// https://stackoverflow.com/questions/35511348/multer-not-adding-file-extension

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

	},
	delete: function (req, res, next) {
		var id = req.params.id,
			password = req.body.password;

		// Check if user exist or not
		db.collection('user').findOneAndDelete({
			_id: mongo.ObjectID(id)
		}, done);

		function done(err) {
			if (err) {
				next(err);
			} else {
				res.redirect('/');
			}
		}
	}
}

module.exports = account;