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
}

module.exports = home;