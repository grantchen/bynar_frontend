const { APIGateway, CognitoIdentityServiceProvider } = require('aws-sdk')

const API = new APIGateway({ region: 'eu-central-1' })
const cognito = new CognitoIdentityServiceProvider({ region: 'eu-central-1' })

const generateApiKey = async (sub) => {
  return await new Promise((resolve, reject) => {
    const params = {
      name: `tutorial-${sub}`,
      generateDistinctId: true,
      enabled: true,
      stageKeys: [
        {
          restApiId: 'bzchesba3g',
          stageName: 'dev',
        },
      ],
    }

    API.createApiKey(params, (err, results) => {
      if (err) reject(err)
      else resolve(results)
    })
  })
}

const addToPlan = async (keyId) => {
  return await new Promise((resolve, reject) => {
    const params = {
      keyId,
      keyType: 'API_KEY',
      usagePlanId: 'x5iccy',
    }

    API.createUsagePlanKey(params, (err, results) => {
      if (err) reject(err)
      else resolve(results)
    })
  })
}

const saveApiKey = async (sub, apikey) => {
  return await new Promise((resolve, reject) => {
    const params = {
      UserAttributes: [
        {
          Name: 'custom:apikey',
          Value: apikey,
        },
      ],
      Username: sub,
      UserPoolId: 'us-east-1_8WMsl8AMg',
    }

    cognito.adminUpdateUserAttributes(params, (err, results) => {
      if (err) reject(err)
      else resolve(results)
    })
  })
}

const main = async (event) => {
  console.log('Event:', event)

  if (event.triggerSource == 'PostConfirmation_ConfirmSignUp') {
    const { sub } = event.request.userAttributes
    const { id, value: apikey } = await generateApiKey(sub)
    await addToPlan(id)
    await saveApiKey(sub, apikey)
  }

  return event
}

exports.handler = main