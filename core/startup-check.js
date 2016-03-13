var mode = process.env.NODE_ENV === undefined ? 'development' : process.env.NODE_ENV;

exports.check = function(){
	console.log( mode );
}