
// ===== Static essential pages 
// ===== pages that not concern with database 
// login, signup, about

var express = require('express');
var router = express.Router();

router.get( '/', function(req, res){
	res.redirect('/dishes');
});

router.get( '/login', function(req, res){
	res.render('login');
});

router.get( '/signup', function(req, res){
	res.render('signup');
});

module.exports = router;