var express 	= require('express');
var router 		= express.Router();
var pg 			= require('pg');
var config 		= require('./config');

router.get('/testerror', function(req, res, next){
	return next(new Error("DDD"));
	res.end("yo");
});

router.get('/dishes', function( req, res, next){
	console.log('/dishes');
	res.end("In progress");
	/*var currentArea = config.areaList[ req.query.area ];
	if( currentArea === undefined ){
		return next();
	}

	var cuisine = 0;
	if( config.cuisineList[req.query.cuisine] !== undefined ){
		cuisine = req.query.cuisine;
	}

	var cuisines = getNumberList( req.query.cuisines );

	var cuisineFilters = [];
	for( var i = 1; i < config.cuisineList.length; i++ ){
		
		var checking = "unchecked";
		
		if( cuisines.indexOf(i) != -1 ){
			checking = "check";
		}

		cuisineFilters.push( { 
			index: i,
			name: config.cuisineList[i],
			checking: checking
		});
		
	}

	var sort = "none";
	if( config.sortList[req.query.sort] !== undefined ){
		sort = req.query.sort;
	}

	var client = new pg.Client(config.conString);
	client.connect(function(err) {
	  	
	  	if(err) {
	    	return console.error('could not connect to postgres', err);
	  	}

	  	var queryString = "SELECT dishes.*," +
	  		"restaurants.name AS restaurant_name FROM dishes " +
	  		"INNER JOIN restaurants ON dishes.restaurant_id=restaurants.id " +
	  		"AND restaurants.location='" + req.query.area + "'";

	  	if( cuisines.length > 0 ){
	  		queryString += " WHERE dishes.cuisine_id IN " + getCuisineQuery(cuisines);
	  	}

	  	if( sort !== "none" ){

	  		if( sort == "price_asc" ){
	  			queryString += " ORDER BY dishes.price ASC";
	  		}	

			else if( sort == "price_desc" ){
	  			queryString += " ORDER BY dishes.price DESC";
	  		}
	  	}

	  	client.query( queryString, function(err, result) {

		    if(err) {
		      return console.error('error running query', err);
		    }
		  	
		    client.end();

		    res.locals.currentSort = config.sortList[sort];
		    if( res.locals.currentSort === undefined ){
		    	res.locals.currentSort = config.sortList['none'];
		    }

		    res.locals.num = result.rows.length;
		    res.locals.currentArea = currentArea;
		    res.locals.areaList = config.areaList;
		    res.locals.cuisineFilters = cuisineFilters;
		    res.locals.sortList = config.sortList;
		    res.locals.dishList = result.rows;
		    res.render('development/dishes', { layout: "jessica", location : "ทุกหมวด" });
	  	});
	});*/
});

router.get('/dishes/:id', function(req, res, next){

	var client = new pg.Client(config.conString);
	client.connect(function(err) {
	  	if(err) {
	    	return console.error('could not connect to postgres', err);
	  	}

	  	var queryString = "SELECT dishes.name, dishes.price, dishes.id, dishes.description, " + 
	  		"restaurants.name AS restaurant_name, restaurants.id AS restaurant_id, restaurants.link AS restaurant_link FROM dishes " +
	  		"INNER JOIN restaurants ON dishes.restaurant_id=restaurants.id " +
	  		"WHERE dishes.id = " + req.params.id + ' LIMIT 1';

	  	client.query( queryString, function(err, result) {
		    if(err) {
		      return console.error('error running query', err);
		    }
		    client.end();

		    if( result.rows.length == 0 ){
		    	var err = new Error('ไม่พบหน้านี้');
    			err.status = 404;
    			return next(err);
		    }

		    res.locals.dish = result.rows[0];
		    res.render('development/dish', { layout : "jessica" });
	  	});
	});
});


/*router.get('/view_mode/:name', function(req, res){

	if( req.params.name == "list" ){
		res.cookie( "view_mode", "list" );
	}
	else{
		res.cookie( "view_mode", "gallery" );
	}

	res.json( { message : "ok" } );
});*/

function getCuisineQuery( cuisineList ){

	var cuisineQuery = "(";
	
	for( var i = 0; i < cuisineList.length; i++ ){
		
		if( i != 0 ){
			cuisineQuery += ",";
		}

		cuisineQuery += cuisineList[i];
	}

	return cuisineQuery + ")";
}

function getNumberList( value ){

	var numList = [];
	if( typeof value == "string" ){

		var dummy = parseInt( value );
		if( !isNaN(value) && !isNaN(dummy) ){
			numList.push( dummy );
		}
	}
	else if( typeof value == "object" ){
		for( var i = 0; i < value.length; i++ ){
			var dummy = parseInt( value[i] );
			if( !isNaN(value[i]) && !isNaN(dummy) ){
				numList.push( dummy );
			}
		}
	}

	return numList;
}

module.exports = router;