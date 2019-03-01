var Case = require('case'),
	filename = Case.kebab('whitespace random$#@#characters filename'),
	firstname = 'Jane',
	lastname = 'Doe',
	fullname = Case.capital(firstname + lastname),
	validator = require('validator');

console.log(filename, fullname, validator.isAlpha(firstname));
