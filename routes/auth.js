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
var signin = require('../controllers/signin');

app
    // post requests
    .post('/account', upload.single('avatar'), account.create)
	.post('/signin', signin.validation)
	
	// put/update
	.put('/account/:id/like', account.like)
	.delete('/account/:id/delete', account.delete)

module.exports = app;