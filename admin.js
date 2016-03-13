process.env.NODE_ENV = 'development';

var express = require('express');
var bodyParser = require('body-parser');
var pg = require('pg');
var config = require('./config/basic');

require('./config/mongoose')();

var app = express();

app.set('views', './app/views');
app.set('view engine', 'jade');
app.use(express.static('./public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function(req, res){
	res.render('admin/home');
});

app.get('/dishes', function(req, res, next){

	var client = new pg.Client(config.pgUri);
	
	client.connect(function(err) {
		
		if(err) return next(err);

		var queryString = 'SELECT * FROM dishes';
		
		client.query(queryString, function(err, result){

			if(err) return next(err);
			client.end();

			res.render('admin/dishes', {
				dishList: result.rows
			});

		});
	
	});

});

app.get('/dishes/:id/edit', function(req, res, next){

	var client = new pg.Client(config.pgUri);
	
	client.connect(function(err) {
		if(err) return next(err);

		var queryString = 'SELECT * FROM dishes WHERE id=' + req.params.id + ' LIMIT 1';

		client.query(queryString, function(err, result){
			if(err) return next(err);
			client.end();

			res.render('admin/dish', {
				dish: result.rows[0]
			});
		});
	});
});
 
app.post('/dishes/:id/edit', function(req, res, next){	

	var client = new pg.Client(config.pgUri);

	client.connect(function(err) {
		if(err) return next(err);

		var queryString = "UPDATE dishes SET name='" + req.body.name + "'"
							+ ' WHERE id=' + req.params.id;
		
		client.query(queryString, function(err, result){
			if(err) return next(err);
			client.end();

			res.redirect('/dishes/' + req.params.id + '/edit');
		});
	});

});


app.get('/restaurants', function(req, res, next){
	var queryString = "SELECT * FROM restaurants";
	getResult( queryString, function(err, result){
		if(err) return next(err);

		res.render('admin/restaurants', {
			restaurantList: result.rows
		});
	});
});

app.get('/restaurants/:id/edit', function(req, res, next){
	var queryString = "SELECT * FROM restaurants WHERE id=" + req.params.id;
	getResult( queryString, function(err, result){
		if(err) return next(err);

		res.render('admin/restaurant', {
			restaurant: result.rows[0]
		});
	});
});

app.post('/restaurants/:id/edit', function(req, res, next){
	var queryString = "UPDATE restaurants SET " 
					+ " phone='" + req.body.phone + "'"
					+ ", web='" + req.body.web + "'"
					+ ", fb='" + req.body.fb + "'"
					+ ", ig='" + req.body.ig + "'"
					+ ", line='" + req.body.line + "'"
					+ " WHERE id=" + req.params.id;

	console.log( queryString );
	getResult( queryString, function(err, result){
		if(err) return next(err);

		res.redirect('/restaurants/' + req.params.id + '/edit');
	});
});

function getResult( queryString, callback ){

	console.log("YO" + queryString);
	var client = new pg.Client(config.pgUri);
	
	client.connect(function(err) {
		
		if(err) {
			client.end();
			return callback(err, {});
		}
		else{
			client.query( queryString, function(err, result){
				client.end();
				return callback(err, result);
			});
		}

	});
}

app.listen(3000);