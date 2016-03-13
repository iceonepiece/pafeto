var mongoose = require('mongoose');

var schema = new mongoose.Schema({
	restaurantId: mongoose.Schema.Types.ObjectId,
	name: String,
	price: Number,
	description: String,
	cuisines: [Number],
	image: String
});

module.exports = mongoose.model( 'dish', schema );