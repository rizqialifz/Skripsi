const keystone = require('keystone');
const middleware = require('./middleware');
const importRoutes = keystone.importer(__dirname);

keystone.pre('routes', function (req, res, next) {
	res.locals.navLinks = [
		//{ label: 'Home', key: 'home', href: '/' },
		//{ label: 'Blog', key: 'blog', href: '/blog' },
		//{ label: 'Gallery', key: 'gallery', href: '/gallery' },
		//{ label: 'Contact', key: 'contact', href: '/contact' },
		{ label: 'Device', key: 'device', href: '/device' },
		{ label: 'SensorNode', key: 'sensornode', href: '/sensornode' },
		{ label: 'Dataset', key: 'dataset', href: '/dataset' },
	];
	res.locals.user = req.user;
	next();
});

keystone.pre('render', middleware.theme);
keystone.pre('render', middleware.flashMessages);

keystone.set('404', function (req, res, next) {
    middleware.theme(req, res, next);
	res.status(404).render('errors/404');
});

// Load Routes
var routes = {
	download: importRoutes('./download'),
	views: importRoutes('./views'),
	api: importRoutes('./api')
};

function checkAPIKey(req, res, next) {
  // you would have the key in an env variable or load it from
  // your database or something.

  res.header('Access-Control-Allow-Headers', keystone.get('api allow headers') || 'Content-Type, Authorization');
  var token = req.headers['x-snow-token']
  if (token === "SECRET_API_KEY") return next();
  	return res.status(403).json({ 
  		'error': 'true',
  		'message': 'missing apiKey header'
  	});
}

exports = module.exports = function (app) {

	// Views
	app.get('/', routes.views.index);
	app.get('/blog/:category?', routes.views.blog);
	app.all('/blog/post/:post', routes.views.post);
	app.all('/sensornode/:device', routes.views.sensornode);
	app.all('/data/:sensornode', routes.views.data);
	app.get('/gallery', routes.views.gallery);
	app.all('/contact', routes.views.contact);
	app.all('/device', routes.views.device);
	//app.all('/sensornode', routes.views.sensornode);
	app.all('/dataset', routes.views.dataset);

	//app.all('/api*', keystone.middleware.api, routes.api.keyAuth);
	app.all('/api*', checkAPIKey);

	app.get('/api/post/list', keystone.middleware.api, routes.api.posts.list);
	app.all('/api/post/create', keystone.middleware.api, routes.api.posts.create);
	app.get('/api/post/:id', keystone.middleware.api, routes.api.posts.get);
	app.all('/api/post/:id/update', keystone.middleware.api, routes.api.posts.update);
	app.get('/api/post/:id/remove', keystone.middleware.api, routes.api.posts.remove);


	app.get('/api/comment/list', keystone.middleware.api, routes.api.comments.list);
	app.all('/api/comment/create', keystone.middleware.api, routes.api.comments.create);
	app.get('/api/comment/:id', keystone.middleware.api, routes.api.comments.get);
	app.all('/api/comment/:id/update', keystone.middleware.api, routes.api.comments.update);
	app.get('/api/comment/:id/remove', keystone.middleware.api, routes.api.comments.remove);


	app.get('/api/device/list', keystone.middleware.api, routes.api.devices.list);
	app.all('/api/device/create', keystone.middleware.api, routes.api.devices.create);
	app.get('/api/device/:id', keystone.middleware.api, routes.api.devices.get);
	app.all('/api/device/:id/update', keystone.middleware.api, routes.api.devices.update);
	app.get('/api/device/:id/remove', keystone.middleware.api, routes.api.devices.remove);


	app.get('/api/sensornode/list', keystone.middleware.api, routes.api.sensornodes.list);
	app.all('/api/sensornode/create', keystone.middleware.api, routes.api.sensornodes.create);
	app.get('/api/sensornode/:id', keystone.middleware.api, routes.api.sensornodes.get);
	app.all('/api/sensornode/:id/update', keystone.middleware.api, routes.api.sensornodes.update);
	app.get('/api/sensornode/:id/remove', keystone.middleware.api, routes.api.sensornodes.remove);


	app.get('/api/dataset/list', keystone.middleware.api, routes.api.datasets.list);
	app.all('/api/dataset/create', keystone.middleware.api, routes.api.datasets.create);
	app.get('/api/dataset/:id', keystone.middleware.api, routes.api.datasets.get);
	app.all('/api/dataset/:id/update', keystone.middleware.api, routes.api.datasets.update);
	app.get('/api/dataset/:id/remove', keystone.middleware.api, routes.api.datasets.remove);


	app.all('/api/notification/send', keystone.middleware.api, routes.api.notifications.send);

	// Downloads
	app.get('/download/users', routes.download.users);

}
