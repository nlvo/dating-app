var express = require('express');
var	app = express();

var account = require('../controllers/account');
var signin = require('../controllers/signin');
var signout = require('../controllers/signout');
var signup = require('../controllers/signup');
var home = require('../controllers/home');

app
    // get request
	.get('/', home.show)
	// .get('/', likey)

    // .get('/account/:id/likes', likey)
    
    .get('/signin', signin.show)
    .get('/account/:id', account.show)
    .get('/signup', signup.show)

    .get('/signout', signout.show)

module.exports = app;

