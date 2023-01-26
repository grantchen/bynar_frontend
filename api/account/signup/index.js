'use strict';

const mysql = require('mysql-await');
const AWS = require('aws-sdk');
AWS.config.update({region: 'eu-central-1'});

const sqlConfig = {
  "connectionLimit" : 10,
  "host"            : 'bynar-cet.ccwuyxj7ucnd.eu-central-1.rds.amazonaws.com',
  "user"            : 'root',
  "password"        : 'Munrfe2022',
  "port"            : '3306',
  "database"        : 'bynar'
};

const cognitoidentityserviceprovider =
  new AWS.CognitoIdentityServiceProvider({
    apiVersion: '2016-04-18'
  });

exports.handler = async function(event, context, callback) {

  // const connection = mysql.createConnection(sqlConfig);

  // connection.on(`error`, (err) => {
  //   console.error(`Connection error ${err.code}`);
  // });

  // /** Perform query on connection */
  // var result = await connection.awaitQuery('SELECT * FROM bynar.accounts;');
  
  // /** Log output */
  // console.log(result);

  // /** End the connection */
  // connection.awaitEnd();

  cognitoidentityserviceprovider.adminUpdateUserAttributes(
    {
      UserAttributes: [
        {
          Name: 'custom:account_id',
          Value: '111111'
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
    body: "Output",
    headers: {'content-type': 'application/json'}
  };

  callback(null, result);
};
