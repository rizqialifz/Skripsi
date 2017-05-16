// check that the key has been provided in the request body,
// could also be a header
keystone = require('keystone');

exports.check = function checkAPIKey(req, res, next) {
	// you would have the key in an env variable or load it from
	// your database or something.
	if (req.body.apiKey === SECRET_API_KEY) return next();
		return res.status(403).json({ 'error': 'no access' });
}

// then bind that middleware in your routes before any paths
// that should be protected


