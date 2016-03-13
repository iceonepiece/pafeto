module.exports = function(app){
	var restaurant = require('../controllers/restaurant.controller');
	app.get('/restaurants/:id', restaurant.one );
};