var keystone = require('keystone');
var Types = keystone.Field.Types;

var SensorNode = new keystone.List('SensorNode', {
	
	label: 'SensorNodes',
	
});

SensorNode.add({
	device: { type: Types.Relationship, initial: true, ref: 'Device', index: true },

	name: { type: String, required: true },
	image: { type: Types.CloudinaryImage },
	miconType: { type: Types.Select, options: 'Arduino Uno, Arduino Leonardo, Arduino Mega'},

	// define all needed settings data
	setPoint: { type: Number },
	opTime: { type: Number },
	intvData: { type: Number },
	status: { type: Number },
	notification: {type: Number},
	// end settings //////////////////

	created_at: { type: Types.Date, default: Date.now, noedit: true, index: true },
});

SensorNode.relationship({ path: 'datasets', ref: 'Dataset', refPath: 'sensornode' });
SensorNode.defaultColumns = 'name, miconType, device, created_at';
SensorNode.register();