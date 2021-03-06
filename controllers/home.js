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

var home = {
	show: function (req, res, next) {
        // check if request session user exista
        var sessionId = req.session.user ? req.session.user.id : null;
        db.collection('user').find({ 
            '_id': { 
                $ne: mongo.ObjectID(sessionId) //show only users Not Equal to logged in user id
            },
            'likes': {
                $ne: mongo.ObjectID(sessionId) //show only users who aren't liked yet by logged in user id
            },
            'superlikes': {
                $ne: mongo.ObjectID(sessionId) //show only users who aren't superliked yet by logged in user id
            }
        }).toArray(done); //find users in db

        function done(err, user) {
            if (err) {
                next(err);
            } 
            if (user) {
                res.render('index.ejs', {
                    user: user,
                    user_logged_in: req.session.user
                });
            } else {
                res.send('buh')
            }
        }
    }
}

module.exports = home;