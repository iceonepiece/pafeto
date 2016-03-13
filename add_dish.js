var express = require('express');
var fs = require('fs');
var pg = require('pg');
var bodyParser = require('body-parser');


var conString = {
    user: "keziqhlzxdpkhb",
    password: "icdA2Ik4yIkdlCLUo31TkrqeF-",
    database: "dfkfs89jdn6hie",
    port: 5432,
    host: "ec2-54-225-192-128.compute-1.amazonaws.com",
    ssl: true
}; 


var app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', function(req, res) {

	var client = new pg.Client(conString);
	
	client.connect(function(err) {
	  	
	  	if(err) {
	    	return console.error('could not connect to postgres', err);
	  	}

	  	var queryString = "SELECT * FROM restaurants";

	  	client.query( queryString, function(err, result) {

		  	if(err) {
		      return console.error('error running query', err);
		    }
		    client.end();
			res.render('add_dish', { restaurants : result.rows });

		});


	});

});




app.get('/all', function(req, res){

	var client = new pg.Client(conString);
	client.connect(function(err) {
	  	if(err) {
	    	return console.error('could not connect to postgres', err);
	  	}
	  	client.query('SELECT * from dishes', function(err, result) {
		    if(err) {
		      return console.error('error running query', err);
		    }

		    client.end();
		    res.locals.menu = result.rows;
		    res.render('menu', { location : "ทุกหมวด" });
	  	});
	});
});

app.get('/load', function(req, res){

	fs.readFile(__dirname + '/db/dishes/dishes.json', function(err, data){
		if(err) throw err;
		res.render('menu', { location : "ทุกหมวด" });
	});
});

app.post('/add_dish', function(req, res){

	var client = new pg.Client(conString);
	client.connect( function(err, client) {

		if(err) {
    		return console.error('error fetching client from pool', err);
  		}
		else
		{
			var queryString = "INSERT INTO dishes values (" 
					+ req.body.id + "," 
					+ "'" + req.body.name + "',"
					+ req.body.price + "," 
					+ "'" + req.body.description + "',"
					+ req.body.restaurant_id + ","
					+ req.body.cuisine_id + ")";

			console.log( queryString );
			client.query( queryString, function(err, result) {

				if (err){ 
					console.error(err); res.send("Error " + err); 
				} 

				client.end();
			});
		}

	});

	res.redirect('/');
});


app.post('/add_restaurant', function(req, res){

	var client = new pg.Client(conString);
	client.connect( function(err, client) {

		if(err) {
    		return console.error('error fetching client from pool', err);
  		}
		else
		{
			var queryString = "INSERT INTO restaurants values (" 
					+ req.body.id + "," 
					+ "'" + req.body.name + "',"
					+ "'" + req.body.description + "',"
					+ "'" + req.body.link + "',"
					+ req.body.cuisine_id + ")";

			console.log( queryString );
			client.query( queryString, function(err, result) {

				if (err){ 
					console.error(err); res.send("Error " + err); 
				} 

				client.end();
			});
		}

	});

	res.redirect('/');
});

app.listen( 3000, function() {
  	console.log('Node app is running on port', 3000 );
});