keystone = require('keystone');
var FCM = require('fcm-push');
var Device = keystone.list('Device');
var User = keystone.list('User');
var SensorNode = keystone.list('SensorNode');
var serverKey = 'AIzaSyD2dUly4Ei8E_yqhf_6MfcN67iAT8ugnJM';
var fcm = new FCM(serverKey);

exports.send = function(req, res) {
	data = (req.method == 'POST') ? req.body : req.query;
	//console.log(data.title);
	//console.log(data.message);
	Device.model.findById( data.deviceid ).exec(function(err, device) {
		//console.log(device.user);
		User.model.findById( device.user ).exec(function(err, user) {
			var idnode=data.message
			
			SensorNode.model.findById( idnode.substr(0,idnode.indexOf(' ')) ).exec(function(err, node) {
			console.log(node.name);

				var dict = []
				dict.push({
					title: data.title,
					device: device.name,
					message: node.name + "-->" + data.message,
					is_background: false,
					image: '',
					timestamp: ''
				});
				//console.log(device.name)
				var message = {
				    //to: 'dhzyC5HLUVA:APA91bFDqRduJKR52ATJgi83zWbwLZkVM6fgCXMHviRXLggNxbcGdPOMzgrKrypaWauHbjh7hEqjcALy0qp4920eklmmrMpqxOnsxKX5WZunRp0XZ2EQar6J12g4JwgBp5hOOzo0U1WU', // required fill with device token or topics
				    to: user.fcmregid,
				    collapse_key: 'your_collapse_key', 

				    data: {
				        data: dict,

				    },

				    notification: {
				        title: data.title,
				        body: data.message
				    }
				};


				//callback style
				fcm.send(message, function(err, response){
				    if (err) {
				        console.log("Something has gone wrong!");
				    } else {
				        console.log("Successfully sent with response: ", response);
				    }
				});

				res.apiResponse({
					error: false,
					message: 'Successfully send message'
				});
			});
		});
	});
	
	
}								