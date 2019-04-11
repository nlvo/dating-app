var logout = {
	show: function (req, res, next) {
		req.session.destroy(function (err) { //destroy the session
			if (err) {
				next(err);
			} else {
				res.redirect('/');
			}
		});
	}
}

module.exports = logout;