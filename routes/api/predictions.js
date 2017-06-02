var async = require('async'),
keystone = require('keystone');

exports.get = function(req, res) {
	//get all post body parameter 
	data = (req.method == 'POST') ? req.body : req.query;
	//console.log(data.idnode)

	// Use python shell
	var PythonShell = require('python-shell');
	var pyshell = new PythonShell('predictMongo.py');
	// send parameter post to python script
	pyshell.send(data.idnode)

	// begin chage data on message string
	pyshell.on('message', function (message) {
	    // received a message sent from the Python script (a simple "print" statement)
	    // split print in python by ,
	    var resi = message.split(",");
	    // pop last data because contain "\r", dont know how to handle
	    resi.pop();
	    //console.log(resi);

	    // make dictionary to story prediction data
		var dict = []; 

		for (var i = 0; i < resi.length; i++) {
			dict.push({
				time: "default",
				senVal: resi[i]
			});
		}
	    //console.log(dict);
	   	// send response as api
		res.apiResponse({
			prediction: dict
		});

	});

	// end the input stream and allow the process to exit
	pyshell.end(function (err) {
	    if (err){
	        throw err;
	    };

	    //console.log('finished predict data');
	});

}