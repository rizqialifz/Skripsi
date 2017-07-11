var keystone = require('keystone');
var Types = keystone.Field.Types;

var SensorType = new keystone.List('SensorType', {
	autokey: { from: 'name', path: 'key', unique: true },
	label: 'SensorTypes',
});

SensorType.add({
	name: { type: String, required: true },
	dataKey: { type: String },
	upper: { type: String },
	lower: { type: String },
});


SensorType.relationship({ ref: 'Dataset', refPath: 'sensortype' });
SensorType.track = true;
SensorType.register();
