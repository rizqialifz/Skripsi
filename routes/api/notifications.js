keystone = require('keystone');
var FCM = require('fcm-push');

var serverKey = 'AIzaSyD2dUly4Ei8E_yqhf_6MfcN67iAT8ugnJM';
var fcm = new FCM(serverKey);

exports.send = function(req, res) {
	data = (req.method == 'POST') ? req.body : req.query;
	console.log(data.title);
	console.log(data.message);
	var message = {
	    to: 'dhzyC5HLUVA:APA91bFDqRduJKR52ATJgi83zWbwLZkVM6fgCXMHviRXLggNxbcGdPOMzgrKrypaWauHbjh7hEqjcALy0qp4920eklmmrMpqxOnsxKX5WZunRp0XZ2EQar6J12g4JwgBp5hOOzo0U1WU', // required fill with device token or topics
	    collapse_key: 'your_collapse_key', 
	    data: {
	        your_custom_data_key: 'your_custom_data_value'
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
			message: 'Successfully send message'
	});
}