var keystone = require('keystone');
var Types = keystone.Field.Types;

var Device = new keystone.List('Device', {
	autokey: { from: 'name', path: 'key', unique: true },
});

Device.add({

	name: { type: String, required: true },
	webaddr: { type: String },
	latitude: { type: String },
	longitude: { type: String },
	image: { type: Types.CloudinaryImage },
	created_at: { type: Types.Date, default: Date.now, noedit: true, index: true },
	user: { type: Types.Relationship, initial: true, ref: 'User', index: true },
	
});

Device.relationship({ path: 'sensornodes', ref: 'SensorNode', refPath: 'device' });
Device.defaultColumns = 'name, image, created_at, user';
Device.register();