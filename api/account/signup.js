'use strict';

const {
  SecretsManagerClient,
  GetSecretValueCommand,
} = require("@aws-sdk/client-secrets-manager");

exports.get = async function(event, context, callback) {

  // Use this code snippet in your app.
  // If you need more information about configurations or implementing the sample code, visit the AWS docs:
  // https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/getting-started.html


  const secret_name = "bynar";

  const client = new SecretsManagerClient({
    region: "eu-central-1",
  });

  let response;

  try {
    response = await client.send(
      new GetSecretValueCommand({
        SecretId: secret_name,
        VersionStage: "AWSCURRENT", // VersionStage defaults to AWSCURRENT if unspecified
      })
    );
  } catch (error) {
    // For a list of exceptions thrown, see
    // https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_GetSecretValue.html
    throw error;
  }

  const secret = response.SecretString;

  // Your code goes here

  var result = {
    statusCode: 200,
    body: secret,
    headers: {'content-type': 'application/json'}
  };

  callback(null, result);
};
