var express = require('express')
var app = express()
var port = 3000

app.set('view engine', 'pug');

app.use(express.static(__dirname + '/public'));

app
  .get('/', home)
  .get('/about', about)
  .get('/login', login)
  .get('/register', register)
  .post('/register', createProfile)
  .use(notFound)

  .listen(port, listening);
 
function home (req, res) {
  res.render('index');
}

function about (req, res) {
  res.render('about');
}

function login (req, res) {
  res.render('login');
}

function register (req, res) {
  res.render('register');
}

function createProfile (req, res) {
  var name = req.body.name,
      description = req.body.description;

  // input[name="username"]
  // req.body.username ^
  // form ...
  // req.body ^

  res.render('login', { name: name,  description: description});
}

function notFound (req, res, next) {
  res.status(404).send('not found 404')
}

function listening() {
  console.log('Listening on port: ' + port);
}
