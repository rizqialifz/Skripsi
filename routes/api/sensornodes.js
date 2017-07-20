var async = require('async'),
keystone = require('keystone');

var SensorNode = keystone.list('SensorNode');
//var redisClient = require('redis').createClient;
//var redis = redisClient(6379, 'localhost');

exports.list = function(req, res) {
	SensorNode.model.find(function(err, items) {
		
		if (err) return res.apiError('database error', err);
		
		res.apiResponse({
			error: false,
			sensornodes: items
		});
		
	});
}

//get node by id device
exports.get = function(req, res) {
	SensorNode.model.find({"device": req.params.id}).exec(function(err, item) {
		
		if (err) return res.apiError('database error', err);
		if (!item) return res.apiError('not found');

		//redis.set("nodebydevice", JSON.stringify(item));
		
		res.apiResponse({
			error: false,
			message: "success get sensornode",
			sensornode: item
		});
		
	});
}

//get node by id node
exports.gets = function(req, res) {
	SensorNode.model.findById(req.params.id).populate('sensortype').exec(function(err, item) {
		
		if (err) return res.apiError('database error', err);
		if (!item) return res.apiError('not found');

		//redis.set("nodebyid", JSON.stringify(item));
		res.apiResponse({
			error: false,
			message: "success get sensornode",
			sensornode: item
		});
		
	});
}

exports.create = function(req, res) {
	
	var item = new SensorNode.model(),
		data = (req.method == 'POST') ? req.body : req.query;
	console.log(data);
	item.getUpdateHandler(req).process(data, function(err) {
		
		if (err) return res.apiError('error', err);
		
		res.apiResponse({
			error: false,
			message: "success create sensornode",
			sensornode: item
		});
		
	});
}

exports.update = function(req, res) {
	SensorNode.model.findById(req.params.id).exec(function(err, item) {
		
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

exports.updates = function(req, res) {
	SensorNode.model.findOneAndUpdate({_id: req.params.id}, req.body, {new: true},function(err, item) {
		
		if (err) return res.apiError('database error', err);
		if (!item) return res.apiError('not found');
		
		var data = (req.method == 'PUT') ? req.body : req.query;
		
		res.apiResponse({
			error: false,
			message: "success update",
			sensornode: item
		});
			
	});
}


exports.remove = function(req, res) {
	SensorNode.model.findById(req.params.id).exec(function (err, item) {
		
		if (err) return res.apiError('database error', err);
		if (!item) return res.apiError('not found');
		
		item.remove(function (err) {
			if (err) return res.apiError('database error', err);
			
			return res.apiResponse({
				error: false,
				message: "success remove",
				success: true
			});
		});
		
	});
}

exports.removelast = function(req, res) {
	SensorNode.model.findOne().sort("-created_at").limit(1).exec(function (err, item) {
		
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