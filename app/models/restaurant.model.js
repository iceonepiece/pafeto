var mongoose = require('mongoose');

var schema = new mongoose.Schema({
	name: String,
	description: String,
	cuisines: [Number],
	phone: String,
	locations: [Number],
	links: {
		web: String,
		fb: String,
		ig: String,
		line: String
	}
});

mongoose.model('Restaurant', schema);