var mongoose = require('mongoose');

var schema = new mongoose.Schema({
	username: String,
	email: String,
	password: String,
	salt: String
});

module.exports = mongoose.model( 'user', schema );
