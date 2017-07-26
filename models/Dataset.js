var keystone = require('keystone');
var Types = keystone.Field.Types;

var Dataset = new keystone.List('Dataset', {
	label: 'Datasets',
});

Dataset.add({

	device: { type: Types.Relationship, initial: true, ref: 'Device', index: true },
	sensornode: { type: Types.Relationship, initial: true, ref: 'SensorNode', index: true },
	//sensortype: { type: Types.Relationship, ref: 'SensorType', many: true },

	setPoint: { type: Number },
	uk: { type: Number },
	opTime: {type: Number },
	data: {

		humidity: { type: Number , collapse:true , note: 'Value Humidity Sensor' },
		temperature: { type: Number , collapse:true, note: 'Value Temperature Sensor' },
		ph: { type: Number , collapse:true, note: 'Value DO (Dissolved Oxygen) Sensor' },
		do: { type: Number , collapse:true, note: 'Value PH (power of hydrogen) Sensor' },
		waterlevel: { type: Number , collapse:true, note: 'Value waterlevel ultrasonic' },
		third: { type: String, dependsOn: { sensortype: 'Humidity (DHT 22)' } },
	},
	created_at: { type: Types.Datetime, default: Date.now, utc: false, noedit: true, index: true },
	
});

Dataset.relationship({ ref: 'SensorNode', refPath: 'datasets' });
Dataset.defaultColumns = 'device, sensornode, created_at';
Dataset.register();

