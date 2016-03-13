
// Database starter
var mongoose = require('mongoose'); 

// Build the connection string 
var url = 'mongodb://heroku_61l4mmb6:jvc4keepi3oj5if0vqed5ab07k@ds053964.mongolab.com:53964/heroku_61l4mmb6'; 

// Create the database connection 
mongoose.connect(url); 

// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on('connected', function () {  
  console.log('Mongoose default connection open to ' + url);
}); 

// If the connection throws an error
mongoose.connection.on('error',function (err) {  
  console.log('Mongoose default connection error: ' + err);
}); 

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {  
  console.log('Mongoose default connection disconnected'); 
});

// If the Node process ends, close the Mongoose connection 
process.on('SIGINT', function() {  
  mongoose.connection.close(function () { 
    console.log('Mongoose default connection disconnected through app termination'); 
    process.exit(0); 
  }); 
}); 


// ========== END OF FILE ==========
