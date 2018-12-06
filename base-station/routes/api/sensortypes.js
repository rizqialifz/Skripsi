var async = require('async'),
keystone = require('keystone');

var SensorType = keystone.list('SensorType');

/**
 * List Posts
 */
exports.list = function(req, res) {
	SensorType.model.find(function(err, items) {
		
		if (err) return res.apiError('database error', err);
		
		res.apiResponse({
			error: false,
			sensortype: items
		});
		
	});
}