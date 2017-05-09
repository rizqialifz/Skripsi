var keystone = require('keystone');
var Types = keystone.Field.Types;


var Dataset = new keystone.List('Dataset', {
	label: 'Datasets',
});

Dataset.add({
	device: { type: Types.Relationship, initial: true, ref: 'Device', index: true },
	sensornode: { type: Types.Relationship, initial: true, ref: 'SensorNode', index: true },
	sensortype: { type: Types.Relationship, ref: 'SensorType', many: true },
	string: { type: String },
	data: {
		humidity: { type: Number , collapse:true , note: 'Value Humidity Sensor' },
		temperature: { type: Number , collapse:true, note: 'Value Temperature Sensor' },
		PH: { type: Number , collapse:true, note: 'Value DO (Dissolved Oxygen) Sensor' },
		DO: { type: Number , collapse:true, note: 'Value PH (power of hydrogen) Sensor' },
		third: { type: String, dependsOn: { sensortype: 'Humidity (DHT 22)' } },
	},
	created_at: { type: Types.Date, default: Date.now, noedit: true, index: true },
});

Dataset.relationship({ ref: 'SensorNode', refPath: 'datasets' });
Dataset.defaultColumns = 'device, sensornode, data';
Dataset.register();

