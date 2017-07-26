var keystone = require('keystone');
var csv = require('csv');
var Dataset = keystone.list("Dataset");
var moment = require('moment');

exports = module.exports = function (req, res) {
	Dataset.model.find(function (err, results) {
		if (err) { throw err; }

		var users = results.map(function (dataset) {
			return {
				sensornode: dataset.sensornode,
				humidity: dataset.data.humidity,
				temperature: dataset.data.temperature,
				waterlevel: dataset.data.waterlevel,
				created_at: moment(dataset.created_at).format('h:mm:ss a')
			};
		});

		csv.stringify(users, function (err2, data) {
			if (err2) { throw err; }

			res.set({"Content-Disposition": "attachment; filename=\"data.csv\""});
			res.send(data);
		});
	});
};
