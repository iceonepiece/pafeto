var Restaurant = require('../models/Restaurant');

exports.profile = function( req, res ){

	var id = req.params.id;
	var userId = req.session.userId;

	Restaurant.findOne({ _id : id, userId : userId } ,"_id logoImage name description web cuisines", function(err, result){
		
		var json = JSON.stringify( result );

		if( json == "null" ){
			res.redirect('/');
		}
		else{

			res.locals.restaurant = result;

			res.render('profile');
		}
	});
}