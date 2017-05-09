var keystone = require('keystone');
var Types = keystone.Field.Types;

var SensorType = new keystone.List('SensorType', {
	autokey: { from: 'name', path: 'key', unique: true },
	label: 'SensorTypes',
});

SensorType.add({
	name: { type: String, required: true },
});


SensorType.relationship({ ref: 'Dataset', refPath: 'sensortype' });
SensorType.track = true;
SensorType.register();
