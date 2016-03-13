
// Account controller

var express 	= require('express');
var router 		= express.Router();
var validator 	= require('validator');
var bcrypt 		= require('bcrypt');
var User  		= require('../models/User');

// log in 
router.get( '/login', checkSession, function(req, res){
	res.render('login');
});

router.post( '/login', checkSession, function(req, res){
	
	var sess = req.session;
	var email = req.body.email.trim();
	var password = req.body.password;

	var errors = [];

	if( email.length == 0 ){
		errors.push('กรุณากรอกอีเมล');
	}

	if( password.length == 0 ){
		errors.push('กรุณากรอกรหัสผ่าน');
	}

	if ( errors.length == 0 )
	{
		User.findOne( { email: email }, function (err, user) {
  		
  			if (err) return err;

	  		if( user != null )
	  		{
	  			bcrypt.hash( password , user.salt, function(err, hash) {
	  				
	  				if( user.password == hash )
	  				{
	  					sess.userId = user._id;
	  					return res.redirect('/');
	  				}
	  				else
	  				{
	  					errors.push('กรุณากรอกอีเมลหรือรหัสผ่านที่ถูกต้อง');

						sess.errors = errors;
						return res.redirect('login');

	  				}

	  			});

	  		}
	  		else
	  		{
	  			errors.push('กรุณากรอกอีเมลหรือรหัสผ่านที่ถูกต้อง');

				sess.errors = errors;
				return res.redirect('login');
	  		}
  		});
	
	}
	else{
		sess.errors = errors;
		return res.redirect('login');
	}
});
// ============


// sign up 
router.get( '/signup', checkSession, function(req, res){
	res.render('signup');
});

router.post( '/signup', checkSession, function(req, res){
	
	var sess = req.session;
	var email = req.body.email.trim();
	var password = req.body.password;
	var confirmPassword = req.body.confirmPassword;

	var errors = [];

	User.findOne({
			email : email
		}, 
		function(err, user){

			// checking email
			if( user != null ){
				errors.push('อีเมลนี้มีผู้ใช้งานแล้ว');
			}
			else if ( email.length == 0 ){
				errors.push('กรุณากรอกอีเมล');
			}
			else if ( !validator.isEmail( email ) ){
				errors.push('กรุณากรอกอีเมลที่ถูกต้อง');
			}

			// checking password
			if( password.length == 0 ){
				errors.push('กรุณากรอกรหัสผ่าน');
			}
			else if( password.length < 8 ){
				errors.push('รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร');
			}

			// checking confirm password
			if( confirmPassword.length == 0 ){
				errors.push('กรุณายืนยันรหัสผ่าน');
			}
			else if( confirmPassword != password ){
				errors.push('กรุณากรอกรหัสผ่านให้ตรงกัน');
			}


			if ( errors.length == 0 )
			{
				bcrypt.genSalt(12, function(err, salt) {
    				bcrypt.hash( password , salt, function(err, hash) {

    					var myUser = new User({
							email : email,
							password: hash,
							salt : salt
						});

						myUser.save( function(err){
							if(err){
								console.log(err);
							}

							return res.redirect('/');

						});

						
	    			});
				});
			}
			else{
				sess.errors = errors;
				return res.redirect('/signup');
			}
	});
});

// log out
router.get( '/logout', function(req, res){
	req.session.destroy();
	res.redirect('/');
});


function checkSession(req, res, next){
	console.log('Enter Account Controller');

	if( req.session.userId ){
		console.log('id');
		return res.redirect('/');
	} 
	next();
}



module.exports = router;
