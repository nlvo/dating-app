// db
var mongo = require('mongodb');
require('dotenv').config();

var db = null,
	dbName = process.env.DB_NAME,
	url = process.env.DB_URL;

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
		// db.collection('user').findOne({
		// 	_id: mongo.ObjectID(id)
		// }, done);
		db.collection('user').aggregate([{
			'$match': {
				'_id': mongo.ObjectID(id)
			}
		}, {
			'$lookup': {
				'from': 'user',
				'localField': 'liked',
				'foreignField': '_id',
				'as': 'liked'
			}
		}, {
			'$lookup': {
				'from': 'user',
				'localField': 'superliked',
				'foreignField': '_id',
				'as': 'superliked'
			}
		}]).toArray(done);

		// https://stackoverflow.com/questions/50250136/mongodb-aggregate-with-match-lookup-and-project
		// console.log(req.params);
		function done(err, user, next) {
			if (err) {
				next(err);
			} else {
				res.render('account.ejs', {
					user: user[0],
					user_logged_in: req.session.user
				});
			}
		}

	},
	like: function (req, res, next) {
		var id = req.params.id;

		if (req.body.like == 'like') {
			// receiver | like
			db.collection('user').updateOne({
				_id: mongo.ObjectID(id),
			}, {
				$addToSet: { //adds value to an array only if it doesn't exist yet
					likes: mongo.ObjectID(req.session.user.id) //gives the user.id of the liker
				},
			});

			// giver | liked
			db.collection('user').updateOne({
				_id: mongo.ObjectID(req.session.user.id),
			}, {
				$addToSet: { //adds value to an array only if it doesn't exist yet
					liked: mongo.ObjectID(id) //save id of the user, who received a like
				},
			}, done);

		} else if (req.body.like == 'superlike') {
			db.collection('user').updateOne({
				_id: mongo.ObjectID(id),
			}, {
				$addToSet: { //adds value to an array only if it doesn't exist yet
					superlikes: mongo.ObjectID(req.session.user.id) //gives the user.id of the liker
				},
			});

			db.collection('user').updateOne({
				_id: mongo.ObjectID(req.session.user.id),
			}, {
				$addToSet: { //adds value to an array only if it doesn't exist yet
					superliked: mongo.ObjectID(id) //gives the user.id of the liker
				},
			}, done);
		}

		function done(err) {
			if (err) {
				next(err);
			} else {
				res.redirect('/');
			}
		}
	},
	// https://stackoverflow.com/questions/34967482/lookup-on-objectids-in-an-array
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
			superlikes: [],
			liked: [],
			superliked: []
		}, done);

		// input[name='username']
		// req.body.username ^
		// form ...
		// req.body ^

		function done(err, user) {
			if (err) {
				next(err);
			} else {
				req.session.user = {
					id: req.body._id,
					name: req.body.name // pass name value inside object to session.user
				};
				res.redirect('/account/' + user.insertedId);
			}

		}
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
	},
	likes: function (req, res) {
		var id = req.params.id; //checks params /profile/:id, pass params id

		//find the correct profile by id
		// db.collection('user').findOne({
		// 	_id: mongo.ObjectID(id)
		// }, done);
		db.collection('user').aggregate([{
			'$match': {
				'_id': mongo.ObjectID(id)
			}
		}, {
			'$lookup': {
				'from': 'user',
				'localField': 'likes',
				'foreignField': '_id',
				'as': 'likes'
			}
		}]).toArray(done);

		// https://stackoverflow.com/questions/50250136/mongodb-aggregate-with-match-lookup-and-project
		// console.log(req.params);
		function done(err, user, next) {
			if (err) {
				next(err);
			} else {
				res.render('account.ejs', {
					user: user[0],
					user_logged_in: req.session.user
				});
			}
		}
	},
	superlikes: function (req, res) {
		var id = req.params.id; //checks params /profile/:id, pass params id

		//find the correct profile by id
		// db.collection('user').findOne({
		// 	_id: mongo.ObjectID(id)
		// }, done);
		db.collection('user').aggregate([{
			'$match': {
				'_id': mongo.ObjectID(id)
			}
		}, {
			'$lookup': {
				'from': 'user',
				'localField': 'superlikes',
				'foreignField': '_id',
				'as': 'superlikes'
			}
		},{
			'$lookup': {
				'from': 'user',
				'localField': 'likes',
				'foreignField': '_id',
				'as': 'likes'
			}
		}, {
			'$lookup': {
				'from': 'user',
				'localField': 'superlikes',
				'foreignField': '_id',
				'as': 'superlikes'
			}
		}]).toArray(done);

		// https://stackoverflow.com/questions/50250136/mongodb-aggregate-with-match-lookup-and-project
		// console.log(req.params);
		function done(err, user, next) {
			if (err) {
				next(err);
			} else {
				res.render('account.ejs', {
					user: user[0],
					user_logged_in: req.session.user
				});
			}
		}
	}
}

module.exports = account;