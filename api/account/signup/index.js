'use strict';

const mysql = require('mysql-await');
const AWS = require('aws-sdk');
AWS.config.update({region: 'eu-central-1'});

const cognitoidentityserviceprovider =
  new AWS.CognitoIdentityServiceProvider({
    apiVersion: '2016-04-18'
  });
  
 

exports.handler = async function(event, context, callback) {
  
  const SM = new AWS.SecretsManager({
    apiVersion: process.env.AWS_SM_API_VERSION,
    region: process.env.AWS_SM_REGION,
  });
  const params = {
    SecretId: 'bynar',
  };

  const secretResponse = await SM.getSecretValue(params)
    .promise()
    .then((data) => {
      console.info(data);
      return JSON.parse(data.SecretString);
    })
    .catch((err) => {
      console.error(err);
      throw err;
    });
  
  const sqlConfig = {
    "connectionLimit" : 10,
    "host"            : secretResponse.host,
    "user"            : secretResponse.username,
    "password"        : secretResponse.password,
    "port"            : secretResponse.port,
    "database"        : secretResponse.dbname,
  };
  
  sqlConfig.user = 'root';
  sqlConfig.database = 'bynar';

  if (!event.username || !event.full_name || !event.postal_code || !event.country_ci || !event.organization_name || !event.tax_number || !event.country_ti) {
    var result = {
      statusCode: 400,
      body: { error: true, message: "Missing params" },
      headers: {'content-type': 'application/json'}
    };
        
    return result.body;
  } else {
  
    const getUserParams = {
      UserPoolId: 'eu-central-1_IWbh7BLrz',
      Username: event.sub,
    };
    var groupData = await cognitoidentityserviceprovider.adminListGroupsForUser(getUserParams).promise();
    
    if (groupData.Groups.length == 0) {
      var result = {
        statusCode: 400,
        body: { error: true, message: "User is not part of any group" },
        headers: {'content-type': 'application/json'}
      };
        
      return result.body;
    } else {
      const connection = mysql.createConnection(sqlConfig);
          
          connection.on(`error`, (err) => {
            console.error(`Connection error ${err.code}`);
          });

          //--- Check if username exists already
          var mysqlResult = await connection.awaitQuery(`SELECT * FROM bynar.accounts where username='${event.username}';`);

          if (mysqlResult.length !== 0) {
            var result = {
              statusCode: 400,
              body: { error: true, message: "Username already exists" },
              headers: {'content-type': 'application/json'}
            };
        
            return result.body;
          } else {

            const userGroupName = groupData.Groups[0].GroupName;
          
            const connection = mysql.createConnection(sqlConfig);
          
            connection.on(`error`, (err) => {
              console.error(`Connection error ${err.code}`);
            });
          
            //--- Insert account info into database
            var mysqlResult = await connection.awaitQuery(`insert into bynar.accounts (username, full_name, country, address, address_2, city, postal_code, state, phone, cognito_user_groups, organization_id, organization_account) 
            values ('${event.username}', '${event.full_name}', '${event.country_ci}', '${event.address_line}', '${event.address_line2}', '${event.city}', ${event.postal_code}, '${event.state}', '${event.phone_number}', '${userGroupName}', 0, 1);`);
            
            console.log("DB RES>>>");
            console.log(mysqlResult);
        
            const account_id = mysqlResult.insertId;
        
            //--- Insert organization info into database
            var mysqlResult = await connection.awaitQuery(`insert into bynar.organisations (description, vat_number, country, status, seller_id) 
            values ('${event.organization_name}', '${event.tax_number}', '${event.country_ti}', 1, 1);`);
            
            console.log("DB RES>>>");
            console.log(mysqlResult);
        
            const organization_id = mysqlResult.insertId;
          
            /** End the connection */
            connection.awaitEnd();
            
            console.log("Saving Data in cognito");
        
        
            //--- save account id and organization id
            var cognitoRes = await cognitoidentityserviceprovider.adminUpdateUserAttributes(
              {
                UserAttributes: [
                  {
                    Name: 'custom:account_id',
                    Value: account_id.toString(),
                  },
                  {
                    Name: 'custom:organization_id',
                    Value: organization_id.toString(),
                  },
                ],
                UserPoolId: 'eu-central-1_IWbh7BLrz',
                Username: event.sub,
              }
            );
            
            // cognitoidentityserviceprovider.adminGetUser(getUserParams, function(err, data) {
            //   if (err) console.log(err, err.stack); // an error occurred
            //   else     console.log(data);           // successful response
            // });
            
            
            
          
            


          }
    }
    
  }
  
  console.log("FINISHED");
  
  var result = {
    statusCode: 200,
    body: { success: true, message: "Success" },
    headers: {'content-type': 'application/json'}
  };
        
  return result.body;

  
};
