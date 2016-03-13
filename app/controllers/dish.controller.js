var sql = require('sql');
var pg = require('pg');
var config = require('../../config/basic');

exports.list = function(req, res, next){

	//init cleanUrl 
	var cleanUrl = "/dishes?";

	// setup [area]
	var currentArea = config.areaList[ req.query.area ];
	if( currentArea === undefined ){
		return next();
	}
	cleanUrl += "area=" + req.query.area;

	// setup [cuisines]
	var cuisines = getNumberList( req.query.cuisines );
	var cuisineFilters = [];	
	for( var i = 1; i < config.cuisineList.length; i++ ){

		var checking = "unchecked";

		if( cuisines.indexOf(i) != -1 ){
			cleanUrl += "&cuisines=" + i;
			checking = "check";
		}
		cuisineFilters.push( { 
			index: i,
			name: config.cuisineList[i],
			checking: checking
		});	
	}

	// setup [sort]
	var sort = "none";
	if( config.sortList[req.query.sort] !== undefined ){
		sort = req.query.sort;
	}
	if(sort != "none") cleanUrl += "&sort=" + sort;

	// setup [page]
	var pageNumber = 1;

	if( req.query.page !== undefined ){
		var dummyNumber = parseInt(req.query.page);

		if( !isNaN(req.query.page) && !isNaN(dummyNumber) ){
			pageNumber = dummyNumber;
		}
	}


	var client = new pg.Client(config.pgUri);
	
	client.connect(function(err){  	
	  	if(err) {
	    	return next(err);
	  	}

	  	var countQuery = "SELECT COUNT(*) FROM dishes" 
	  					+ " INNER JOIN restaurants ON dishes.restaurant_id=restaurants.id"
	  					+ " AND restaurants.location='" + req.query.area + "'";

	  	if( cuisines.length > 0 ){
	  		countQuery += " WHERE dishes.cuisine_id IN " + getCuisineQuery(cuisines);
	  	}

	  	client.query( countQuery, function(err, result){
	  		
	  		if(err) return next(err);

	  		var dishQuery = "SELECT dishes.*, restaurants.name AS restaurant_name FROM dishes" 
	  					+ " INNER JOIN restaurants ON dishes.restaurant_id=restaurants.id"
	  					+ " AND restaurants.location='" + req.query.area + "'";

	  		if( cuisines.length > 0 ){
	  			dishQuery += " WHERE dishes.cuisine_id IN " + getCuisineQuery(cuisines);		
	  		}

	  		if( sort !== "none" ){
		  		if( sort == "price_asc" ) dishQuery += " ORDER BY dishes.price ASC";
				else if( sort == "price_desc" ) dishQuery += " ORDER BY dishes.price DESC";
		  	}

		  	var totalResult = result.rows[0].count;
		  	var menuPerPage = 9;
			var pageOffset = (pageNumber - 1) * menuPerPage;
			var startMenu = ( pageNumber * menuPerPage ) - ( menuPerPage - 1 );
			var totalPage = Math.floor( totalResult / menuPerPage );

			if( totalResult > totalPage * menuPerPage ){
				totalPage++;
			}
			
			var isFirstPage = false;
			var isLastPage = false;
			
			if( pageNumber === 1 ){
				isFirstPage = true;
			}
			if( pageNumber === totalPage ){
				isLastPage = true;
			}

			dishQuery += " LIMIT " + menuPerPage + " OFFSET " + pageOffset;

		  	client.query( dishQuery, function(err, result){

		  		if(err) return next(err);

			    client.end();

			    res.locals.currentSort = config.sortList[sort];
			    if( res.locals.currentSort === undefined ){
			    	res.locals.currentSort = config.sortList['none'];
			    }

			    var endMenu = startMenu + result.rows.length - 1;

				res.locals.num = startMenu + " - " + endMenu + " จาก " + totalResult;
			    res.locals.currentArea = currentArea;
			    res.locals.areaList = config.areaList;
			    res.locals.cuisineFilters = cuisineFilters;
			    res.locals.sortList = config.sortList;
			    res.locals.dishList = result.rows;
			    return res.render('test', { 
			    	title: 'Pafeto',
			    	location : "ทุกหมวด",
			    	lastPage: totalPage,
			    	isFirstPage: isFirstPage,
			    	isLastPage: isLastPage,
			    	cleanUrl: cleanUrl,
			    	pageNumber: pageNumber
			    });

		  	});
	  	});


	});

	/*var pageNumber = 1;

	if( req.query.page !== undefined ){
		var dummyNumber = parseInt(req.query.page);

		if( !isNaN(req.query.page) && !isNaN(dummyNumber) ){
			pageNumber = dummyNumber;
		}

	}

	var cleanUrl = "/dishes?";
	cleanUrl += "area=" + req.query.area;

	var cuisine = 0;
	if( config.cuisineList[req.query.cuisine] !== undefined ){
		cuisine = req.query.cuisine;
	}

	var cuisines = getNumberList( req.query.cuisines );

	var cuisineFilters = [];
	for( var i = 1; i < config.cuisineList.length; i++ ){
		
		var checking = "unchecked";
		
		if( cuisines.indexOf(i) != -1 ){
			cleanUrl += "&cuisines=" + i;
			checking = "check";
		}

		cuisineFilters.push( { 
			index: i,
			name: config.cuisineList[i],
			checking: checking
		});
		
	}

	var sort = "none";
	if( config.sortList[req.query.sort] !== undefined ){
		sort = req.query.sort;
	}

	if(sort != "none")
		cleanUrl += "&sort=" + sort;

	var client = new pg.Client(config.pgUri);
	client.connect(function(err) {
	  	
	  	if(err) {
	    	return next(err);
	  	}

	  	var countQuery = "SELECT COUNT(*) FROM dishes" 
	  					+ " INNER JOIN restaurants ON dishes.restaurant_id=restaurants.id"
	  					+ " AND restaurants.location='" + req.query.area + "'";


	  	var queryString = "SELECT dishes.*," +
	  		"restaurants.name AS restaurant_name FROM dishes " +
	  		"INNER JOIN restaurants ON dishes.restaurant_id=restaurants.id " +
	  		"AND restaurants.location='" + req.query.area + "'";

	  	if( cuisines.length > 0 ){
	  		countQuery += " WHERE dishes.cuisine_id IN " + getCuisineQuery(cuisines);
	  		queryString += " WHERE dishes.cuisine_id IN " + getCuisineQuery(cuisines);
	  	}

	  	console.log( sort );

	  	if( sort !== "none" ){

	  		if( sort == "price_asc" ){
	  			countQuery += " ORDER BY dishes.price ASC";
	  			queryString += " ORDER BY dishes.price ASC";
	  		}	

			else if( sort == "price_desc" ){
				countQuery += " ORDER BY dishes.price DESC";
	  			queryString += " ORDER BY dishes.price DESC";
	  		}
	  	}

	  	client.query( countQuery, function(err, result){

	  		if(err) {
				return next(err);
			}

			var totalResult = result.rows[0].count;

			var menuPerPage = 9;
			var pageOffset = (pageNumber - 1) * menuPerPage;
			var startMenu = ( pageNumber * menuPerPage ) - ( menuPerPage - 1 );
			var totalPage = Math.floor( totalResult / menuPerPage );

			if( totalResult > totalPage * menuPerPage ){
				totalPage++;
			}
			
			var isFirstPage = false;
			var isLastPage = false;
			
			if( pageNumber === 1 ){
				isFirstPage = true;
			}
			if( pageNumber === totalPage ){
				isLastPage = true;
			}

			queryString += " LIMIT " + menuPerPage + " OFFSET " + pageOffset;

	  		client.query( queryString, function(err, result) {

			    if(err) {
			      return next(err);
			    }
			  	
			    client.end();

			    res.locals.currentSort = config.sortList[sort];
			    if( res.locals.currentSort === undefined ){
			    	res.locals.currentSort = config.sortList['none'];
			    }

			    var endMenu = startMenu + result.rows.length - 1;

			    console.log( cleanUrl );

				res.locals.num = startMenu + " - " + endMenu + " จาก " + totalResult;
			    res.locals.currentArea = currentArea;
			    res.locals.areaList = config.areaList;
			    res.locals.cuisineFilters = cuisineFilters;
			    res.locals.sortList = config.sortList;
			    res.locals.dishList = result.rows;
			    return res.render('dishes', { 
			    	title: 'Pafeto',
			    	location : "ทุกหมวด",
			    	lastPage: totalPage,
			    	isFirstPage: isFirstPage,
			    	isLastPage: isLastPage,
			    	cleanUrl: cleanUrl,
			    	pageNumber: pageNumber
			    });
		  	});

	  	});
	});*/
};

exports.read = function(req, res, next){
	var client = new pg.Client(config.pgUri);
	client.connect(function(err) {
	  	if(err) {
	    	return next(err);
	  	}

	  	var queryString = "SELECT dishes.name, dishes.price, dishes.id, dishes.description, " + 
	  		"restaurants.name AS restaurant_name, restaurants.id AS restaurant_id FROM dishes " +
	  		"INNER JOIN restaurants ON dishes.restaurant_id=restaurants.id " +
	  		"WHERE dishes.id = " + req.params.id + ' LIMIT 1';

	  	client.query( queryString, function(err, result) {
		    if(err) {
		      return next(err);
		    }
		    client.end();

		    if( result.rows.length == 0 ){
		    	var err = new Error('ไม่พบหน้านี้');
    			err.status = 404;
    			return next(err);
		    }

		    res.locals.dish = result.rows[0];
		    return res.render('dish', {title: res.locals.dish.name});
	  	});
	});
};

function getCuisineQuery( cuisineList ){
	var cuisineQuery = "(";
	
	for( var i = 0; i < cuisineList.length; i++ ){
		if( i != 0 ){
			cuisineQuery += ",";
		}
		cuisineQuery += cuisineList[i];
	}

	return cuisineQuery + ")";
}

function getNumberList( value ){
	var numList = [];
	if( typeof value == "string" ){

		var dummy = parseInt( value );
		if( !isNaN(value) && !isNaN(dummy) ){
			numList.push( dummy );
		}
	}
	else if( typeof value == "object" ){
		for( var i = 0; i < value.length; i++ ){
			var dummy = parseInt( value[i] );
			if( !isNaN(value[i]) && !isNaN(dummy) ){
				numList.push( dummy );
			}
		}
	}

	return numList;
}