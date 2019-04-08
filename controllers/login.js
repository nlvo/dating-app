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

var login = {
    validation: function (req, res, next) {
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
                    name: user.name, // pass name value inside object to session.user
                    id: user._id
                };
                res.redirect('/account/' + user._id);
            } else {
                res.send('not found')
            }
        }
    },
    show: function (req, res) {
        res.render('login.ejs');
    }
}
// https://stackoverflow.com/questions/33589571/module-exports-that-include-all-functions-in-a-single-line

function logout(req, res, next) {
    req.session.destroy(function (err) { //destroy the session
        if (err) {
            next(err);
        } else {
            res.redirect('/');
        }
    });
}

module.exports = login;