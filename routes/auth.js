var express = require('express');
var	app = express();

var // form
	multer = require('multer'),
	mime = require('mime-types'),
	storage = multer.diskStorage({
		destination: function (req, file, cb) {
			cb(null, 'public/uploads')
		},
		filename: function (req, file, cb) {
			cb(null, file.fieldname + '-' + Date.now() + '.' + mime.extension(file.mimetype))
		}
	}),
	upload = multer({
		dest: 'public/uploads',
		storage: storage
	});

var account = require('../controllers/account');
var login = require('../controllers/login');
var signup = require('../controllers/signup');

app
    .get('/login', login.show)
    // .get('/logout', logout)
    .get('/account/:id', account.show)
    .get('/signup', signup.show)

    // // post requests
    .post('/account', upload.single('avatar'), account.create)
    .post('/login', login.validation)

module.exports = app;