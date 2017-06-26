var async = require('async'),
keystone = require('keystone');

var Device = keystone.list('Device');
var redisClient = require('redis').createClient;
var redis = redisClient(6379, 'localhost');


exports.list = function(req, res) {
	Device.model.find(function(err, items) {
		
		if (err) return res.apiError('database error', err);
		
		res.apiResponse({
			error: false,
			devices: items
		});
		
	});
}

exports.get = function(req, res) {
	Device.model.findById(req.params.id).exec(function(err, item) {
		
		if (err) return res.apiError('database error', err);
		if (!item) return res.apiError('not found');
		
		res.apiResponse({
			device: item
		});
		
	});
}

exports.getsCached = function(req, res) {

	redis.get('device', function (err, reply) {
        if (err) return res.apiError('database error', err);
        else if (reply) {
    		res.apiResponse({
				error: false,
				device: JSON.parse(reply)
			});
		}
        else {
			Device.model.find({"user": req.params.id}).exec(function(err, item) {
				
				if (err) return res.apiError('database error', err);
				if (!item) return res.apiError('not found');
				
				res.apiResponse({
					error: false,
					device: item
				});
				
			});
		}
	});
}
exports.gets = function(req, res) {
	Device.model.find({"user": req.params.id}).exec(function(err, item) {
		
		if (err) return res.apiError('database error', err);
		if (!item) return res.apiError('not found');

		//redis.set("device", JSON.stringify(item));
		
		res.apiResponse({
			error: false,
			device: item
		});
		
	});
}
exports.create = function(req, res) {
	
	var item = new Device.model(),
		data = (req.method == 'POST') ? req.body : req.query;
	
	item.getUpdateHandler(req).process(data, function(err) {
		
		if (err) return res.apiError('error', err);
		
		res.apiResponse({
			error: false,
			message: "success create device",
			device: item
		});
		
	});
}


exports.update = function(req, res) {
	Device.model.findById(req.params.id).exec(function(err, item) {
		
		if (err) return res.apiError('database error', err);
		if (!item) return res.apiError('not found');
		
		var data = (req.method == 'POST') ? req.body : req.query;
		
		item.getUpdateHandler(req).process(data, function(err) {
			
			if (err) return res.apiError('create error', err);
			
			res.apiResponse({
				device: item
			});
			
		});
		
	});
}


exports.remove = function(req, res) {
	Device.model.findById(req.params.id).exec(function (err, item) {
		
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