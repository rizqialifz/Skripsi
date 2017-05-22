var keystone = require('keystone');
var Device = keystone.list('Device');
var Dataset = keystone.list('Dataset');
var SensorNode 	= keystone.list('SensorNode');


exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);

	var locals = res.locals;

	// Init locals
	locals.section = 'index';
	locals.devices = [];
	locals.sensornodes = [];
	locals.datasets = [];

	// Load the devices
	view.on('init', function (next) {

		Device.model.find(function(err, items) {
			locals.devices = items

		});

		SensorNode.model.find(function(err, items) {
			locals.sensornodes = items

		});
		Dataset.model.find(function(err, items) {
			locals.datasets = items
			next(err);	
		});

	});

	view.render('index', {
		section: 'home',
	});

}
