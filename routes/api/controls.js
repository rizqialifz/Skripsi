keystone = require('keystone');
var SensorNode = keystone.list('SensorNode');

exports.control = function(req, res) {
	data = (req.method == 'POST') ? req.body : req.query;

	console.log(data.idnode);
	console.log(data.status);
	SensorNode.model.findById(data.idnode).exec(function(err, item) {

		item.getUpdateHandler(req).process(data, function(err) {
			if (data.idnode == "590e00f72476bf2dbca3e394") var id = 14 ;
			else if (data.idnode == "590e19d1ac49692798cdab4c") var id = 15;
			else if (data.idnode == "591fb531e576db31a4b6a504") var id = 16;
			console.log(id);

			var request = require("request");
			var options = { method: 'POST',
				url: 'http://192.168.43.139:5555/'+id+'/'+data.status,
				headers: 
				{ 
					'postman-token': '16cd996d-f2c5-419f-c3bd-c7ecbdf9bfe4',
					'cache-control': 'no-cache',
					'x-snow-token': 'SECRET_API_KEY',
					'content-type': 'application/x-www-form-urlencoded' 
				}
			};
			request(options, function (error, response, body) {
				if (error) throw new Error(error);
				console.log(body);
			});

			res.apiResponse({
				error: false,
				message: 'Successfully update state'
			});
				
		});
	});


}