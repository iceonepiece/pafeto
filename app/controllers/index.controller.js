var config = require('../../config/basic');

exports.render = function(req, res){
	res.redirect('/dishes?area=bkk');
};

exports.test = function(req, res){
	res.render('test');
};