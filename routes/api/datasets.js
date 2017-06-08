var async = require('async'),
keystone = require('keystone');

var Dataset = keystone.list('Dataset');

/**
 * List Posts
 */
exports.list = function(req, res) {
	Dataset.model.find(function(err, items) {
		
		if (err) return res.apiError('database error', err);
		
		res.apiResponse({
			error: false,
			datasets: items
		});
		
	});
}
/**
 * Get Post by ID
 */
exports.get = function(req, res) {
	Dataset.model.find({"sensornode": req.params.id}).sort('-created_at').exec(function(err, item) {
		
		if (err) return res.apiError('database error', err);
		if (!item) return res.apiError('not found');
		
		res.apiResponse({
			error: false,
			dataset: item
		});
		
	});
}


/**
 * Create a Post
 */
exports.create = function(req, res) {
	
	var item = new Dataset.model(),
		data = (req.method == 'POST') ? req.body : req.query;
	
	item.getUpdateHandler(req).process(data, function(err) {
		
		if (err) return res.apiError('error', err);
		
		res.apiResponse({
			dataset: item
		});
		
	});
}

/**
 * Get Post by ID
 */
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

/**
 * Delete Post by ID
 */
exports.remove = function(req, res) {
	Dataset.model.findById(req.params.id).exec(function (err, item) {
		
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