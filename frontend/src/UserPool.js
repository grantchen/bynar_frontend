import { CognitoUserPool } from 'amazon-cognito-identity-js';

const poolData = {
  UserPoolId: 'eu-central-1_IWbh7BLrz',
  ClientId: '1bmp66b2352s3c0bsll8c5qfd9'
};

export default new CognitoUserPool(poolData);