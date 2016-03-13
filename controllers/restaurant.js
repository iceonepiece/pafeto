var express 	= require('express');
var request		= require('request');
var router 		= express.Router();
var pg 			= require('pg');
var Restaurant 	= require('../models/Restaurant');
var config 		= require('./config');


/*router.get('/restaurants', function(req, res){

	var location = "all";
	
	if( config.locationList[req.query.location] !== undefined )
	{
		location = req.query.location;
	}

	var cuisine = 0;
	
	if( config.cuisineList[req.query.cuisine] !== undefined )
	{
		cuisine = req.query.cuisine;
	}

	var client = new pg.Client( config.conString );
	client.connect(function(err){
		
		if(err) {
	    	return console.error('could not connect to postgres', err);
	  	}

	  	//var queryString = "SELECT restaurants.*, cuisines.name AS cuisine_name FROM restaurants "
	  				//+ "LEFT JOIN cuisines ON restaurants.cuisine_id=cuisines.id";

	  	var whereQueryString = "";

	  	if( location != 'all' )
	  	{
	  		whereQueryString += " WHERE location LIKE '%" + location + "%'";
	  	}

	  	if( cuisine != 0 )
	  	{
	  		if ( whereQueryString.length != 0 ){
	  			whereQueryString += " AND cuisines LIKE '%" + cuisine + "%'";
	  		}
	  		else{
	  			whereQueryString += " WHERE cuisines LIKE '%" + cuisine + "%'";
	  		}
	  	}

	  	var queryString = "SELECT * FROM restaurants" + whereQueryString;

	  	client.query( queryString, function(err, result) {
		    
		    if(err) {
		      return console.error('error running query', err);
		    }

		    res.locals.num = result.rows.length;

		    for( var i = 0; i < res.locals.num; i++ ){
		    	result.rows[i].cuisine_name = getCuisineString( result.rows[i].cuisines );
		    }

		    res.locals.locationList = config.locationList;
			res.locals.location_name = config.locationList[location];
		  	res.locals.cuisineList = config.cuisineList;
		    res.locals.cuisine_name = config.cuisineList[cuisine];
		    res.locals.restaurants = result.rows;
		
		    console.log( res.locals.restaurants );

		    client.end();
		    res.render('restaurants');
		});

	 });

});*/

router.get('/restaurants/:id', function(req, res, next){

	// adding something
	var client = new pg.Client(config.conString);
	client.connect(function(err){
		
		if(err) {
	    	return console.error('could not connect to postgres', err);
	  	}

	  	var queryString = "SELECT restaurants.*, cuisines.name AS cuisine_name FROM restaurants "
	  				+ "LEFT JOIN cuisines ON restaurants.cuisine_id=cuisines.id "
	  				+ "WHERE restaurants.id = " + req.params.id + ' LIMIT 1';

	  	client.query( queryString, function(err, result) {
		    
		    if(err) {
		      return console.error('error running query', err);
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
		      		return console.error('error running query', err);
		    	}

		    	res.locals.areaName = config.areaList[res.locals.restaurant.location];
		    	res.locals.dishList = result.rows;
		    	client.end();

		    	res.render('development/restaurant', { layout : 'jessica' } );
		    });
	  	});
	})

});


exports.manage = function( req, res ){

	var id = req.params.id;
	var userId = req.session.userId;

	Restaurant.findOne({ _id : id, userId : userId } ,"_id name description web cuisines", function(err, result){
		
		var json = JSON.stringify( result );

		if( json == "null" )
			res.redirect('/');
		else
			res.end( json );
	});
}

exports.newDishPage = function( req, res ){

	var id = req.params.id;
	var userId = req.session.userId;

	Restaurant.findOne({ _id : id, userId : userId } ,"_id name description web cuisines", function(err, result){
		
		var json = JSON.stringify( result );

		if( json == "null" ){
			res.redirect('/');
		}
		else{
			res.locals.restaurant = result;
			res.locals.cuisineList = config.cuisineList.slice(1, config.cuisineList.length );
			res.render('addDish', { layout : 'manager' } );
		}

	});

}

exports.newDish = function( req, res ){


}

function getCuisineString( cuisines ){
	
	if( cuisines.length == 0 )
		return "";

	var myList = cuisines.split('-');

	var cuisineString = config.cuisineList[ myList[0] ];

	for( var i = 1; i < myList.length; i++ ){
		cuisineString += ", " + config.cuisineList[ myList[i] ];
	}
	
	return cuisineString;
}

module.exports = router;
