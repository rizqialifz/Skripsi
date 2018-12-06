var keystone	= require('keystone');
var Device		= keystone.list('Device');
var SensorNode 	= keystone.list('SensorNode');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Init locals
	locals.section = 'device';
	locals.filters = {
		device: req.params.device,
	};

	
	// Load the current device
	view.on('init', function (next) {

		var q = Device.model.findOne({
			key: locals.filters.device,
		})

		q.exec(function (err, result) {
			locals.device = result;
			next(err);
		});

	});

	view.on('init', function (next) {

		SensorNode.model.find()
			.where('device', locals.device)
			.exec(function (err, sensornodes) {
				if (err) return res.err(err);
				if (!sensornodes) return res.notfound('Sensor node not found');
				locals.sensornodes = sensornodes;
				next();
			});

	});

	// Render the view
	view.render('sensornode');

}
