var keystone = require('keystone');
var Device = keystone.list('Device');
var Dataset = keystone.list('Dataset');
var SensorNode 	= keystone.list('SensorNode');


exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Init locals
	locals.section = 'home';
	locals.devices = [];
	locals.sensornodes = [];
	locals.datasets = [];

	// Load the devices
	view.on('init', function (next) {

		Device.model.find(function(err1, items1) {
			locals.devices = items1


		});

		SensorNode.model.find(function(err2, items2) {
			locals.sensornodes = items2
			

		});
		
		Dataset.model.find(function(err3, items3) {
			locals.datasets = items3
			next(err3);	
		});

	});

	view.render('index', {
		section: 'home',
	});

}
