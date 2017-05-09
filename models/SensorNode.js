var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
	Posts
	=====
 */

var SensorNode = new keystone.List('SensorNode', {
	label: 'SensorNodes',
});

SensorNode.add({
	device: { type: Types.Relationship, initial: true, ref: 'Device', index: true },
	//datasets: { type: Types.Relationship, initial: true, ref: 'Dataset', index: true },
	name: { type: String, required: true },
	miconType: { type: Types.Select, options: 'Arduino Uno, Arduino Leonardo, Arduino Mega'},
	created_at: { type: Types.Date, default: Date.now, noedit: true, index: true },
});

SensorNode.relationship({ path: 'datasets', ref: 'Dataset', refPath: 'sensornode' });
SensorNode.defaultColumns = 'name, miconType, device, created_at';
SensorNode.register();