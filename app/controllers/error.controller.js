exports.notFound = function(req, res, next){
	next(new Error('Not Found'));
}

exports.error = function(err, req, res, next){
	if(err.message != 'Not Found'){
		err.message = 'Error';
	}
	res.render('notFound', { message : err.message });
};

