var path = require('path');
var fs = require('fs');
var join = path.join;
var Restaurant = require('../models/Restaurant');

module.exports = create;

function create( req, res ){

	var img = req.file;
	var name = req.body.restaurantName.trim();
	var description = req.body.restaurantDescription;
	var web	= req.body.web.trim();
	var cuisine = req.body.cuisine;

	
	var targetPath = join( 'public/images/restaurants' , img.filename );


	var errors = [];

	if( name.length == 0 ){
		errors.push('กรุณากรอกชื่อร้านอาหาร');
	}

	if (typeof cuisine == 'undefined' || cuisine.length > 3 ){
		errors.push('สามารถใส่ประเภทอาหารได้ 1 - 3 ชนิดเท่านั้น');
	}	

	req.session.errors = errors;

	if( errors.length == 0 ){

		fs.rename( img.path, targetPath, function(err){
			if(err) console.log("fs error: " + err);

			var myRestaurant = new Restaurant({ 
				userId: req.session.userId,
				name: name, 
				description: description,
				web: web,
				cuisines: cuisine,
				logoImage: img.filename
			});

			myRestaurant.save( function(err){
				console.log('SAVED');
				return res.redirect('/dashboard');
			});

		});

	}
	else{
		return res.redirect('/create');
	}

}

function addRestaurantToDB(){
	
}


