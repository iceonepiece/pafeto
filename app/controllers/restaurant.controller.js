var pg = require('pg');
var config = require('../../config/basic');

exports.one = function(req, res, next){

	var client = new pg.Client(config.pgUri);
	client.connect(function(err){
		
		if(err) {
	    	return next(err);
	  	}

	  	var queryString = "SELECT restaurants.*, cuisines.name AS cuisine_name FROM restaurants "
	  				+ "LEFT JOIN cuisines ON restaurants.cuisine_id=cuisines.id "
	  				+ "WHERE restaurants.id = " + req.params.id + ' LIMIT 1';

	  	client.query( queryString, function(err, result) {
		    
		    if(err) {
		      return next(err);
		    }

		    if( result.rows.length == 0 ){
		    	var err = new Error('ไม่พบหน้านี้');
    			err.status = 404;
    			return next(err);
		    }

		    res.locals.restaurant = result.rows[0];
		    

		    var queryDishes = "SELECT dishes.name, dishes.price, dishes.id " 
		    	+ "FROM dishes WHERE restaurant_id=" + req.params.id;

		    client.query( queryDishes, function(err, result){

		    	if(err) {
		      		return next(err);
		    	}

		    	res.locals.areaName = config.areaList[res.locals.restaurant.location];
		    	res.locals.dishList = result.rows;
		    	client.end();

		    	res.render('restaurant', {title: res.locals.restaurant.name});
		    });
	  	});
	})

}