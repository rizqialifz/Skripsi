var keystone = require('keystone');
var async = require('async');
var SensorNode = keystone.list('SensorNode');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Init locals
	locals.section = 'node';
	locals.sensornodes = [];

	// Load the devices
	view.on('init', function (next) {

		var q = SensorNode.paginate({
				page: req.query.page || 1,
 				perPage: 10,
 				maxPages: 10,
			})

		q.exec(function (err, results) {
			locals.sensornodes = results;
			next(err);
		});

	});

	// Render the view
	view.render('node');

}
