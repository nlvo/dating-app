const express = require('express')
const pug = require('pug')
const app = express()
const port = 3000

app.set('view engine', 'pug');

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/about', (req, res) => {
  res.render('about');
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.use(express.static(__dirname + '/public'));

app.use(function (req, res, next) {
  return res.status(404).send('not found 404')
})

app.listen(port);
