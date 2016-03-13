process.env.NODE_ENV = process.env.NODE_ENV || 'development';

require('./config/mongoose')();

var express = require('./config/express');
var app = express();

app.listen(app.get('port'), function() {
  	console.log('Node app is running on port', app.get('port'));
});

module.exports = app;
