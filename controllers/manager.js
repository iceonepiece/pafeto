exports.session = function( req, res, next ){

	if( !req.session.userId ){
		return res.redirect('/');
	}
	next();
}
