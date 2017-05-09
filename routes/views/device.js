var keystone = require('keystone');
var async = require('async');
var Device = keystone.list('Device');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Init locals
	locals.section = 'device';
	locals.devices = [];

	// Load the devices
	view.on('init', function (next) {

		var q = Device.paginate({
				page: req.query.page || 1,
 				perPage: 10,
 				maxPages: 10,
			})

		q.exec(function (err, results) {
			locals.devices = results;
			next(err);
		});

	});

	// Render the view
	view.render('device');

}
