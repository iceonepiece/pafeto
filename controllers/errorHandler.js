
// Error Handlers

var express = require('express');
var router 	= express.Router();

router.use(function(req, res, next) {

    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});


router.use(function(err, req, res, next) {
	console.log("XXX");
    res.status(err.status || 500);
    res.render('error', {
    	layout: "jessica",
        message: err.message,
        error: {}
    });
});

module.exports = router;