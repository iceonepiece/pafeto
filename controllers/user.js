var mongoose = require('mongoose');
var validator = require('validator');
var bcrypt = require('bcrypt');
var config = require('./config');
var UserModel = require('../models/User');

exports.test = function( req, res ){
	res.render('login');
}

exports.login = function( req, res ){

	if( req.session.userId ){
		return res.redirect('/');
	}

	var errorText = "";
	if(req.session.errors){
		errorText = req.session.errors;	
		req.session.destroy();
	}

	res.render('login', { errors : errorText } );
}


exports.signup = function( req, res ){

	if( req.session.userId ){
		return res.redirect('/');
	}

	var errorText = "";
	if(req.session.errors){
		errorText = req.session.errors;	
		req.session.destroy();
	}
	res.render('signup', { errors : errorText } );
	
}

exports.doLogin = function( req, res ){
	
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
		UserModel.findOne( { email: email }, function (err, user) {
  		
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
}

exports.doSignup = function( req, res ){

	var sess = req.session;
	var email = req.body.email.trim();
	var password = req.body.password;
	var confirmPassword = req.body.confirmPassword;

	var errors = [];

	UserModel.findOne({
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

    					var myUser = new UserModel({
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
	
}


exports.logout = function( req, res ){
	req.session.destroy();
	res.redirect('/');
}