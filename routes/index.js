//var redisClient = require('redis').createClient;
//var redis = redisClient(6379, 'localhost');
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
		{ label: 'SensorNode', key: 'node', href: '/node' },
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

var User = keystone.list('User');
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

function checkAPI(req, res, next){
	var apiKey= req.headers['authorization']
	User.model.findOne({ "apiKey": apiKey }).exec(function(err, user) {
		if (!user){
			return res.status(403).json({ 
		  		'error': 'true',
		  		'message': 'no access'
		  		
		  	});
		}
		else{
			return next();
		}

	});
}



exports = module.exports = function (app) {

	// Views
	app.get('/', routes.views.index);
	app.get('/blog/:category?', routes.views.blog);
	app.all('/blog/post/:post', routes.views.post);
	app.get('/gallery', routes.views.gallery);
	app.all('/contact', routes.views.contact);

	// single to view all
	app.all('/device', routes.views.device);
	app.all('/node', routes.views.nodes);
	app.all('/dataset', routes.views.dataset);

	// view by id
	app.all('/sensornode/:device', routes.views.sensornode);
	app.all('/data/:sensornode', routes.views.data);

	//app.all('/api*', checkAPIKey);
	app.all('/api/device*', checkAPI);
	app.all('/api/sensornode*', checkAPI);
	app.all('/api/devices*', checkAPI);
	app.all('/api/sensornodes*', checkAPI);
	app.all('/api/dataset*', checkAPI);


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
	app.get('/api/devices/:id', keystone.middleware.api, routes.api.devices.gets);
	app.all('/api/device/:id/update', keystone.middleware.api, routes.api.devices.update);
	app.all('/api/device/:id/remove', keystone.middleware.api, routes.api.devices.remove);


	app.get('/api/sensornode/list', keystone.middleware.api, routes.api.sensornodes.list);
	app.all('/api/sensornode/create', keystone.middleware.api, routes.api.sensornodes.create);
	app.get('/api/sensornode/:id', keystone.middleware.api, routes.api.sensornodes.get);
	app.get('/api/sensornodes/:id', keystone.middleware.api, routes.api.sensornodes.gets);
	app.all('/api/sensornode/:id/update', keystone.middleware.api, routes.api.sensornodes.update);
	app.all('/api/sensornode/:id/remove', keystone.middleware.api, routes.api.sensornodes.remove);


	app.get('/api/dataset/list', keystone.middleware.api, routes.api.datasets.list);
	app.all('/api/dataset/create', keystone.middleware.api, routes.api.datasets.create);
	app.get('/api/dataset/:id', keystone.middleware.api, routes.api.datasets.get);
	//app.get('/api/datasets/:id', keystone.middleware.api, routes.api.datasets.gets);
	app.all('/api/dataset/:id/update', keystone.middleware.api, routes.api.datasets.update);
	app.all('/api/dataset/:id/remove', keystone.middleware.api, routes.api.datasets.remove);


	app.all('/api/notification/send', keystone.middleware.api, routes.api.notifications.send);
	app.all('/api/prediction/get', keystone.middleware.api, routes.api.predictions.get);
	app.all('/api/prediction/gets', keystone.middleware.api, routes.api.predictions.gets);
	app.all('/api/control', keystone.middleware.api, routes.api.controls.control)


	app.all('/api/signin', keystone.middleware.api, routes.api.authenticate.signin);
	app.all('/api/signup', keystone.middleware.api, routes.api.authenticate.signup);
	app.all('/api/signout', keystone.middleware.api, routes.api.authenticate.signout);

	//////////////////////////////////// with redis //////////////////////////////////////////////////
	app.get('/api/devicesCache/:id', keystone.middleware.api, routes.api.devices.getsCached);


	/////////////////////////////////// end chache redis /////////////////////////////////////////////
	// Downloads
	app.get('/download/users', routes.download.users);

}
