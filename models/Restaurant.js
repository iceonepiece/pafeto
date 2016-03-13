var mongoose = require('mongoose');

var schema = new mongoose.Schema({
	userId: mongoose.Schema.Types.ObjectId,
	name: String,
	description: String,
	web: String,
	cuisines: [Number],
	logoImage: String
});

module.exports = mongoose.model( 'restaurant', schema );