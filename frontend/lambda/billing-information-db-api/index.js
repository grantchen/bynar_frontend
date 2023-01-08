const vandium = require( 'vandium' );

var mysql      = require('mysql');

exports.handler = vandium.generic()
    .handler( (event, context, callback) => {

  var connection = mysql.createConnection({
    host     : 'bynaram.cl04lf7wpgxz.us-east-2.rds.amazonaws.com',
    user     : 'root',
    password : 'Munrfe2020',
    database : 'bynar'
  });

	connection.query('SELECT * FROM billing_information', function (error, results, fields) {

	callback( null, results );
		
  });
});