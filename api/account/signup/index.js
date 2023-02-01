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

  const connection = mysql.createConnection(sqlConfig);

  connection.on(`error`, (err) => {
    console.error(`Connection error ${err.code}`);
  });

  /** Perform query on connection */
  var mysqlResult = await connection.awaitQuery("insert into bynar.accounts (username, full_name, country, address, address_2, city, postal_code, state, phone, cognito_user_groups, organization_id, organization_account) values ('test', 'Test', 'AL', 'address', 'address 2', 'city', 11111, 'state', 'phone', 'cognito_user_groups', 0, 1);");
  
  /** Log output */
  console.log("DB RES>>>");
  console.log(mysqlResult);

  /** End the connection */
  connection.awaitEnd();
  
  
  // const getUserParams = {
  //   UserPoolId: 'eu-central-1_IWbh7BLrz',
  //   Username: 'fcb8a134-e79b-4d34-81b7-184ed2946a88'
  // };
  // cognitoidentityserviceprovider.adminGetUser(getUserParams, function(err, data) {
  //   if (err) console.log(err, err.stack); // an error occurred
  //   else     console.log(data);           // successful response
  // });
  
  

  cognitoidentityserviceprovider.adminUpdateUserAttributes(
    {
      UserAttributes: [
        {
          Name: 'custom:account_id',
          Value: mysqlResult.insertId.toString(),
        }
      ],
      UserPoolId: 'eu-central-1_IWbh7BLrz',
      Username: 'fcb8a134-e79b-4d34-81b7-184ed2946a88'
    },
    function(err, data) {
      if (err) {
        console.log(err);
        return;
      }
      console.log(data);
    }
  );

  var result = {
    statusCode: 200,
    body: secretResponse,
    headers: {'content-type': 'application/json'}
  };

  callback(null, result);
};
