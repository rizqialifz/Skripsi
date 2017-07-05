var async = require('async'),
keystone = require('keystone');
var User = keystone.list('User');
var crypto = require('crypto');
var jwt    = require('jsonwebtoken');
var express = require('express');
var app = express();

app.set('jwtTokenSecret', 'YOUR_SECRET_STRING');

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


		//var token = jwt.sign({ foo: 'bar' }, app.get('jwtTokenSecret'));
		keystone.session.signin({ email: user.email, password: data.password }, req, res, function(user) {	  
			res.apiResponse({
				error: false,
				success: true,
				session: true,
				date: new Date().getTime(),
				userId: user.id,
				username: user.name,
				email: user.email,
				phone: user.phone,
				// token: token,
				apiKey: user.apiKey
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

exports.signup = function(req, res) {
	
	var item = new User.model(),
		data = (req.method == 'POST') ? req.body : req.query;

	var id = crypto.randomBytes(16).toString('hex');
	//console.log(data);
	//console.log(id);
	data.apiKey = id;
	item.getUpdateHandler(req).process(data, function(err) {
		
		if (err) return res.apiError('error', err);
		
		res.apiResponse({
			error: false,
			message: "success create User",
			user: item
		});
		
	});
}

// you'll want one for signout too
exports.signout = function (req, res) {

	keystone.session.signout(req, res, function() {
		res.apiResponse({ 'signedout': true });
	});

}

exports.update = function(req, res) {
	User.model.findById(req.params.id).exec(function(err, item) {
		
		if (err) return res.apiError('database error', err);
		if (!item) return res.apiError('not found');
		
		var data = (req.method == 'PUT') ? req.body : req.query;
		
		item.getUpdateHandler(req).process(data, function(err) {
			
			if (err) return res.apiError('create error', err);
			
			res.apiResponse({
				error: false,
				message: "success update",
				sensornode: item
			});
			
		});
		
	});
}
