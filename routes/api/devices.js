var async = require('async'),
keystone = require('keystone');

var Device = keystone.list('Device');

/**
 * List Posts
 */
exports.list = function(req, res) {
	Device.model.find(function(err, items) {
		
		if (err) return res.apiError('database error', err);
		
		res.apiResponse({
			error: false,
			devices: items
		});
		
	});
}

/**
 * Get Post by ID
 */
exports.get = function(req, res) {
	Device.model.findById(req.params.id).exec(function(err, item) {
		
		if (err) return res.apiError('database error', err);
		if (!item) return res.apiError('not found');
		
		res.apiResponse({
			device: item
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
			device: item
		});
		
	});
}

/**
 * Get Post by ID
 */
exports.update = function(req, res) {
	Devicee.model.findById(req.params.id).exec(function(err, item) {
		
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

/**
 * Delete Post by ID
 */
exports.remove = function(req, res) {
	Device.model.findById(req.params.id).exec(function (err, item) {
		
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