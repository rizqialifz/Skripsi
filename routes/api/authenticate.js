var async = require('async'),
keystone = require('keystone');
var User = keystone.list('User');

exports.signin = function (req, res) {
	data = (req.method == 'POST') ? req.body : req.query;
 	if (!data.username || !data.password) return res.apiResponse({ success: false });
  
	User.model.findOne({ email: data.username }).exec(function(err, user) {

		if (err || !user) {
			res.apiResponse({
				error: true,
				success: false,
				session: false,
				message: (err && err.message ? err.message : false) || 'Sorry, there was an issue signing you in, please try again.'
			});
		}


		keystone.session.signin({ email: user.email, password: data.password }, req, res, function(user) {	  
			res.apiResponse({
				error: false,
				success: true,
				session: true,
				date: new Date().getTime(),
				userId: user.id,
				username: user.email,
				token: user.token,
				apiKey: "SECRET_API_KEY"
			});
		  
		}, function(err) {
		  
			res.apiResponse({
				error: true,
				success: true,
				session: false,
				message: (err && err.message ? err.message : false) || 'Sorry, there was an issue signing you in, please try again.'
			});
		  
		});

	});
}
// you'll want one for signout too
exports.signout = function (req, res) {

	keystone.session.signout(req, res, function() {
		res.apiResponse({ 'signedout': true });
	});

}