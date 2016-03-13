// # Pafeto Startup

var app = require('express')();
var middleware = require('./middleware');

// connect mongodb 
require('./core/db');

middleware( app );

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});

// dependent modules
/*var compression		= require('compression');
var morgan 			= require('morgan');
var fs 				= require('fs');
var exphbs 			= require('express-handlebars');
var express 		= require('express');

// controllers
var db 					= require('./controllers/db');
var account 			= require('./controllers/account');
var dashboard 			= require('./controllers/dashboard');
var dish 				= require('./controllers/dish');
var restaurant 			= require('./controllers/restaurant');
var api					= require('./controllers/api');
var errorHandler 		= require('./controllers/errorHandler');

// models
var Log 				= require('./models/Log');

var app = express();

app.engine('handlebars', exphbs( {defaultLayout: 'main'} ) );
app.set('view engine', 'handlebars');

app.set('port', (process.env.PORT || 5000));

app.use(compression());
app.use(express.static(__dirname + '/public'));

app.use( morgan('common', { 
		stream: {
			write: function(msg){
				console.log(msg);
				var newLog = new Log({ message : msg});
				newLog.save( function(err){} );
			}
		}
}));


// ========= Development Field ============

//app.use( account );
//app.use( dashboard );
//app.use( '/api', api );


// ========================================

app.get('/', function(req, res){
	res.redirect('/dishes?area=bkk');
});


app.use( dish );
app.use( restaurant );

app.use(function(req, res, next) {
    var err = new Error('ไม่พบหน้านี้');
    err.status = 404;
    next(err);
});

app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
    	layout: "jessica",
        message: err.message,
        error: {}
    });
});

function getLogText( request ){
	return request.ip + ' - GET ' + request.originalUrl + ' - ' + Date() + '\n';
}


app.listen(app.get('port'), function() {
  	console.log('Node app is running on port', app.get('port'));
});*/



