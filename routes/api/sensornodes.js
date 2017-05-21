var async = require('async'),
	keystone = require('keystone');

var SensorNode = keystone.list('SensorNode');

/**
 * List Posts
 */
exports.list = function(req, res) {
	SensorNode.model.find(function(err, items) {
		
		if (err) return res.apiError('database error', err);
		
		res.apiResponse({
			error: false,
			sensornodes: items
		});
		
	});
}

/**
 * Get Post by ID
 */
exports.get = function(req, res) {
	SensorNode.model.find({"device": req.params.id}).exec(function(err, item) {
		
		if (err) return res.apiError('database error', err);
		if (!item) return res.apiError('not found');
		
		res.apiResponse({
			error: false,
			sensornode: item
		});
		
	});
}


/**
 * Create a Post
 */
exports.create = function(req, res) {
	
	var item = new Post.model(),
		data = (req.method == 'POST') ? req.body : req.query;
	
	item.getUpdateHandler(req).process(data, function(err) {
		
		if (err) return res.apiError('error', err);
		
		res.apiResponse({
			sensornode: item
		});
		
	});
}

/**
 * Get Post by ID
 */
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

/**
 * Delete Post by ID
 */
exports.remove = function(req, res) {
	SensorNode.model.findById(req.params.id).exec(function (err, item) {
		
		if (err) return res.apiError('database error', err);
		if (!item) return res.apiError('not found');
		
		item.remove(function (err) {
			if (err) return res.apiError('database error', err);
			
			return res.apiResponse({
				success: true
			});
		});
		
	});
}