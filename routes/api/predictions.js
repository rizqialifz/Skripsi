var async = require('async'),
keystone = require('keystone');



exports.get = function(req, res) {
	var myPythonScriptPath = 'predictMongo.py';

	// Use python shell
	var PythonShell = require('python-shell');
	var pyshell = new PythonShell(myPythonScriptPath);

	pyshell.on('message', function (message) {
	    // received a message sent from the Python script (a simple "print" statement)
	    //console.log(message);
	    message = message.replace('/r','');
	    var resi = message.split(",");
	    resi.pop();
	    console.log(resi);
	    var dict = []; // create an empty array


		for (var i = 0; i < resi.length; i++) {
			dict.push({
				key: "senval",
				value: resi[i]
			});
			
		}
	    console.log(dict);
		res.apiResponse({
			prediction: dict
		});
	});

	// end the input stream and allow the process to exit
	pyshell.end(function (err) {
	    if (err){
	        throw err;
	    };
	    console.log('finished');
	    

	});

	


}