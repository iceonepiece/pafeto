$(document).ready( function(){

	$(".filter-item").click(function(event){
		
		// get original url
		var urlVariables = window.location.search.substring(1).split('&');
		var area = getUrlParameter( "area", urlVariables );
		var cuisines = getCuisines( urlVariables );
		var sort = getUrlParameter( "sort", urlVariables );
		// ------

		// edit url
		var lastClass = $(this).attr('class').split(' ').pop();

		if( lastClass === "cuisine-text" ){

			var cuisineId = $(this).attr('id');
			
			var index = getIndexOf( cuisineId, cuisines );
			
				if( index == -1 ){
					cuisines.push( cuisineId );
				}
				else{
					cuisines.splice( index, 1 );
				}
		}
		else if( lastClass === "sort" ){

			var sortType = $(this).attr('id');
			
			if( sortType === "none" ){
				sort = "";
			}
			else{
				sort = "sort=" + sortType;
			}			
		}
		// --------

		var optionList = [];

		// add area
		optionList.push( area );

		// add cuisines
		for( var i = 0; i < cuisines.length; i++ ){
			optionList.push( "cuisines=" + cuisines[i] );
		}

		// add sort
		if( sort.length > 0 ){
			optionList.push( sort );
		}

		var extendUrl = getOptionString(optionList);
	
		var targetUrl = "/dishes";

		if( extendUrl != "" )
		{
			targetUrl += "?" + extendUrl;
		}
		
		window.location.href = targetUrl;			
		return false;			
		});

	function getIndexOf( value, array ){

		for( var i = 0; i < array.length; i++ ){
			if( value === array[i] ){
				return i;
			}
		}

		return -1;
	}

	function getOptionString( optionList ){

		var optionString = "";
		for( var i = 0; i < optionList.length; i++ ){
				
			optionString += optionList[i];

			if( (i + 1) < optionList.length )
			{
				optionString += "&";
			}
		}

		return optionString;
	}

		function getCuisines( urlVariables ){

			var cuisines = [];

			for( var i = 0; i < urlVariables.length; i++ ){
			var paramName = urlVariables[i].split('=');
			if( paramName[0] === "cuisines" ){
				cuisines.push( paramName[1] );
			}
		}
		return cuisines;
		}

		function getUrlParameter( key, urlVariables ){

		for( var i = 0; i < urlVariables.length; i++ )
		{
			var paramName = urlVariables[i].split('=');
			if( paramName[0] == key )
			{
				return key + "=" + paramName[1];
			}
		}
		return "";
	}

});