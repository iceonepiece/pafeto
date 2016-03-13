
// API Controller

var express 	= require('express');
var Restaurant 	= require('../models/Restaurant');
var Dish 		= require('../models/Dish');
var router 		= express.Router();

router.use( function(req, res, next){
	console.log('Enter Pafeto API');
	next();
});

router.get('/dish/:name', function(req, res){

	var dish = { name : req.params.name };
	res.json(dish);
});

router.get('/dishes', function(req, res){

	var data = [ { name : "soup" } ];
	res.json(data);
	/*Dish.find({}, function(err, result){
			
		if(err) next(err);

		res.json(result);
	});*/
});


router.post('/dishes', function(req, res){

	var dish = new Dish({
		restaurantId : req.body.restaurantId,
		name : req.body.name,
		price : req.body.price,
		description : req.body.description,
		image : "dddd"
	});

	dish.save( function(err, dish){
		if(err) {
			res.json( { message : err } );
		}
		else{
			res.json( dish );
		}
	});


})


router.get('/restaurants', function(req, res, next){
	
	Restaurant.find({}, function(err, result){
			
		if(err) next(err);

		res.json(result);
	});
});

module.exports = router;