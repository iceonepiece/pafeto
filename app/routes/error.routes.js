module.exports = function(app){
	var error = require('../controllers/error.controller');
	
	app.use( error.notFound );
	app.use( error.error );
}