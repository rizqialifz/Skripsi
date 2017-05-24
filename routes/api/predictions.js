var async = require('async'),
keystone = require('keystone');
var myString;


exports.get = function(req, res) {
	var myPythonScriptPath = 'predictMongo.py';

	// Use python shell
	var PythonShell = require('python-shell');
	var pyshell = new PythonShell(myPythonScriptPath);

	pyshell.on('message', function (message) {
	    // received a message sent from the Python script (a simple "print" statement)
	    myString = message
	    console.log(message);
	});

	// end the input stream and allow the process to exit
	pyshell.end(function (err) {
	    if (err){
	        throw err;
	    };

	    
	});
		
	var li = JSON.stringify(myString)
	console.log(myString);
	res.apiResponse({
		prediction: li
	});

}