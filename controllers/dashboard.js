
// Dashboard controller

var express 	= require('express');
var router 		= express.Router();
var config 		= require('./config');
var Restaurant 	= require('../models/Restaurant');

router.get( '/dashboard', checkSession, function(req, res){
	
	Restaurant.find({ userId : req.session.userId }, "_id name description logoImage", function(err, result){

		if(err) console.log(err);

		res.locals.restaurants = result;

		res.render('dashboard', { layout : 'manager' } );

	});
});

router.get( '/create', checkSession, function(req, res){

	var errorText = "";
	if(req.session.errors){
		errorText = req.session.errors;	
		req.session.errors = "";
	}

	res.locals.cuisineList = config.cuisineList.slice(1, config.cuisineList.length );
	res.render('create', { layout : 'manager', errors : errorText } );
});


function checkSession(req, res, next){

	if( !req.session.userId ){
		return res.redirect('/');
	} 
	next();
}

module.exports = router;


