const vandium = require( 'vandium' );

var mysql  = require('mysql');

exports.handler = vandium.generic()
    .handler( (event, context, callback) => {

        var bi_id = event.bi_id;

        if (bi_id) {
            var connection = mysql.createConnection({
                host     : 'bynaram.cl04lf7wpgxz.us-east-2.rds.amazonaws.com',
                user     : 'root',
                password : 'Munrfe2020',
                database : 'bynar'
            });
        
          sql = "DELETE FROM billing_information WHERE id = " + bi_id + ";";
        
          connection.query(sql, function (error, results, fields) {
        
            if (error) {
                response = {
                    code: 400,
                    error: error,
                };
            } else {
                response = {
                    code: 200,
                };
            }
          
            
          callback( null, response );
            
          });
        } else {
                
            callback( null, {
                code: 400,
                error: "Missing input parameters."
            } );
        }

    
});