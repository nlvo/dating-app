var express = require('express');
var	app = express();

var account = require('../controllers/account');
var login = require('../controllers/login');
var logout = require('../controllers/logout');
var signup = require('../controllers/signup');
var home = require('../controllers/home');

app
    // get request
	.get('/', home.show)
	// .get('/', likey)

    // .get('/account/:id/likes', likey)
    
    .get('/login', login.show)
    .get('/account/:id', account.show)
    .get('/signup', signup.show)

    .get('/logout', logout.show)

module.exports = app;

