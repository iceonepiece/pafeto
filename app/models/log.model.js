var mongoose = require('mongoose');

var schema = new mongoose.Schema({
	message: String
});

mongoose.model('Log', schema);