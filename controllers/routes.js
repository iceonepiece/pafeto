var express = require('express');
var passport = require('passport');
var Account = require('../models/Account');
var router = express.Router();


router.get('/signup', function(req, res) {
    res.render('signup', { });
});

router.post('/signup', function(req, res) {
    Account.register(new Account({ username : req.body.email }), req.body.password, function(err, account) {
        if (err) {
            return res.render('signup', { account : account });
        }

        passport.authenticate('local')(req, res, function () {
            res.redirect('/');
        });
    });
});

router.get('/login', function(req, res) {
    res.render('login', { user : req.user });
});

router.post('/login', passport.authenticate('local'), function(req, res) {
    res.redirect('/');
});

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

router.get('/ping', function(req, res){
    res.status(200).send("pong!");
});

module.exports = router;