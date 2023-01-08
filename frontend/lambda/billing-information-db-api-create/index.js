const vandium = require( 'vandium' );

var mysql  = require('mysql');

exports.handler = vandium.generic()
    .handler( (event, context, callback) => {

        var bi_id = event.bi_id;
        var account_id = event.account_id;
        var company_id = event.company_id;
        var full_name = event.full_name;
        var country = event.country;
        var address = event.address;
        var address_2 = event.address_2;
        var city = event.city;
        var postal_code = event.postal_code;
        var state = event.state;
        var phone = event.phone;
        var organizaton_name = event.organizaton_name;
        var vat_number = event.vat_number;

        if (bi_id && account_id && company_id && full_name && country && address && address_2 && city && postal_code && state && phone && organizaton_name && vat_number) {
          sql = "UPDATE bynar.billing_information SET full_name = " + connection.escape(full_name) + ", country = " + connection.escape(country) + ", address = " + connection.escape(address) + ", address_2 = " + connection.escape(address_2) + ", city = " + connection.escape(city) + ", postal_code = " + connection.escape(postal_code) + ", state = " + connection.escape(state) + ", phone = " + connection.escape(phone) + ", organizaton_name = " + connection.escape(organizaton_name) + ", vat_number = " + connection.escape(vat_number) + " WHERE id = " + connection.escape(bi_id) + ";";
  
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
              response['bi_id'] = results.updateId;
            }
            callback( null, response );
          });
        } else if (account_id && company_id && full_name && country && address && address_2 && city && postal_code && state && phone && organizaton_name && vat_number) {
            var connection = mysql.createConnection({
                host     : 'bynaram.cl04lf7wpgxz.us-east-2.rds.amazonaws.com',
                user     : 'root',
                password : 'Munrfe2020',
                database : 'bynar'
            });

            connection.query("SELECT * FROM billing_information WHERE account_id = "  + connection.escape(account_id) + " AND company_id = " + connection.escape(company_id) + ";", function (error, results, fields) {

                if (results.length == 0) {
                    sql = "INSERT INTO billing_information(account_id, company_id, full_name, country, address, address_2, city, postal_code, state, phone, organizaton_name, vat_number)";
        
                    sql = sql + " VALUES(" + connection.escape(account_id) + ", " + connection.escape(company_id) + ", " + connection.escape(full_name) + ", " + connection.escape(country) + ", " + connection.escape(address) + ", " + connection.escape(address_2) + ", " + connection.escape(city) + ", " + connection.escape(postal_code) + ", " + connection.escape(state) + ", " + connection.escape(phone) + ", " + connection.escape(organizaton_name) + ", " + connection.escape(vat_number) + ")";
                  
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
                            response['bi_id'] = results.insertId;
                      }
                    
                      
                    callback( null, response );
                      
                    });
                } else {
                    sql = "UPDATE bynar.billing_information SET full_name = " + connection.escape(full_name) + ", country = " + connection.escape(country) + ", address = " + connection.escape(address) + ", address_2 = " + connection.escape(address_2) + ", city = " + connection.escape(city) + ", postal_code = " + connection.escape(postal_code) + ", state = " + connection.escape(state) + ", phone = " + connection.escape(phone) + ", organizaton_name = " + connection.escape(organizaton_name) + ", vat_number = " + connection.escape(vat_number) + " WHERE account_id = " + connection.escape(account_id) + " AND company_id = " + connection.escape(company_id) + ";";
        
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
                            response['bi_id'] = results.updateId;
                      }
                    
                      
                    callback( null, response );
                      
                    });
                }
                    
            });
        
          
        } else {
                
            callback( null, {
                code: 400,
                error: "Missing input parameters."
            } );
        }

    
});