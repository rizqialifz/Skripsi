var async = require('async'),
keystone = require('keystone');

var Dataset = keystone.list('Dataset');
//var redisClient = require('redis').createClient;
//var redis = redisClient(6379, 'localhost');


exports.list = function(req, res) {
	Dataset.model.find(function(err, items) {
		
		if (err) return res.apiError('database error', err);
		
		res.apiResponse({
			error: false,
			datasets: items
		});
		
	});
}

exports.get = function(req, res) {
	Dataset.model
		.find({"sensornode": req.params.id})
		.limit(30)
		.sort('-created_at')
		.populate({
			path: 'sensornode',
			populate:{
				path: 'sensortype'
			}

		})
		//.populate('sensortype')
		.exec(function(err, item) {
		
		if (err) return res.apiError('database error', err);
		if (!item) return res.apiError('not found');

		//redis.set("dataset", JSON.stringify(item));
		
		res.apiResponse({
			error: false,
			dataset: item
		});
		
	});
}


exports.create = function(req, res) {
	
	var item = new Dataset.model(),
		data = (req.method == 'POST') ? req.body : req.query;
	
	item.getUpdateHandler(req).process(data, function(err) {
		
		if (err) return res.apiError('error', err);
		
		res.apiResponse({
			error: false,
			message: "success create data",
			dataset: item
		});
		
	});
}

exports.update = function(req, res) {
	Dataset.model.findById(req.params.id).exec(function(err, item) {
		
		if (err) return res.apiError('database error', err);
		if (!item) return res.apiError('not found');
		
		var data = (req.method == 'POST') ? req.body : req.query;
		
		item.getUpdateHandler(req).process(data, function(err) {
			
			if (err) return res.apiError('create error', err);
			
			res.apiResponse({
				dataset: item
			});
			
		});
		
	});
}


exports.remove = function(req, res) {
	Dataset.model.findById(req.params.id).exec(function (err, item) {
		
		if (err) return res.apiError('database error', err);
		if (!item) return res.apiError('not found');
		
		// item.remove(function (err) {
		// 	if (err) return res.apiError('database error', err);
			
		// 	return res.apiResponse({
		// 		error: false,
		// 		message: "success remove",
		// 		success: true
		// 	});
		// });
		res.apiResponse({
			error: false,
			message: "success create data",
			dataset: item
		});
		
	});
}



exports.removelast = function(req, res) {
	Dataset.model.findOne().sort("-created_at").limit(1).exec(function (err, item) {
		
		if (err) return res.apiError('database error', err);
		if (!item) return res.apiError('not found');

		item.remove(function (err) {
			if (err) return res.apiError('database error', err);
			
			return res.apiResponse({
				error: false,
				message: "success remove "+item._id,
				success: true
			});
		});
		// res.apiResponse({
		// 	error: false,
		// 	message: "success create data",
		// 	dataset: item
		// });
		
	});


}