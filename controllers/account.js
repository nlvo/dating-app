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
		db.collection('user').aggregate([
			{
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
			}
		  ]
		).toArray(done);

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
			console.log(user)
			// console.log(user[0].likes[0].name)
		}

	},
	like: function(req, res, next) {
		var id = req.params.id;
		db.collection('user').updateOne({
			_id: mongo.ObjectID(id)
		}, {
			$push: {
				likes: mongo.ObjectID(req.session.user.id), //gives the user.id of the liker
			},
		}, done);
	
		function done(err) {
			if (err) {
				next(err);
			} else {
				res.redirect('/');
			}
		}
	},
	allLikes: function (req, res) {
		var id = req.params.id; //checks params /profile/:id, pass params id
		// db.collection('user').find({
		// 	likes: [mongo.ObjectID(id)]
		// }).toArray(done);
		
		db.collection('user').aggregate([
			{	
				$match: {
					'_id': id
				}
			},
			{
				$lookup: {
					from: 'user',
					localField: 'likes',
					foreignField: '_id',
					as: 'allLikes'
				}
			}, done])

		function done(err, user) {
			if (err) {
				next(err);
			} else {
				console.log(user)

				res.redirect('/account/' + user.id + '/likes');
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