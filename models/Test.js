var mongoose = require('mongoose');

var schema = new mongoose.Schema({
	name: String,
	rank: Number
});

module.exports = mongoose.model( 'test', schema );
