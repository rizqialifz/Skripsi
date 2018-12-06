var keystone	= require('keystone');
var SensorNode 	= keystone.list('SensorNode');
var Dataset		= keystone.list('Dataset');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Init locals
	locals.section = 'sensornode';
	locals.filters = {
		sensornode: req.params.sensornode,
	};

	
	// Load the current device
	view.on('init', function (next) {

		var q = SensorNode.model.findOne({
			_id: locals.filters.sensornode,
		})

		q.exec(function (err, result) {
			locals.sensornode = result;
			next(err);
		});

	});

	view.on('init', function (next) {

		Dataset.model.find()
			.where('sensornode', locals.sensornode)
			.limit(10)
			.sort('-created_at')
			.exec(function (err, datasets) {
				if (err) return res.err(err);
				if (!datasets) return res.notfound('Sensor node not found');
				locals.datasets = datasets;
				next();
			});

	});

	// Render the view
	view.render('data');

}
