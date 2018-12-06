var keystone = require('keystone');
var async = require('async');
var Dataset = keystone.list('Dataset');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;


	// Init locals
	locals.section = 'dataset';
	locals.datasets = [];

	// Load the datasets
	view.on('init', function (next) {

		var q = Dataset.paginate({
				page: req.query.page || 1,
 				perPage: 10,
 				maxPages: 10,
			})

		q.exec(function (err, results) {
			locals.datasets = results;
			next(err);
		});

	});

	// Render the view
	view.render('dataset');
}
