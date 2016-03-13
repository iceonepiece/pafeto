module.exports = function(app){
	var dish = require('../controllers/dish.controller');
	app.get('/dishes', dish.list );
	app.get('/dishes/:id', dish.read );
};