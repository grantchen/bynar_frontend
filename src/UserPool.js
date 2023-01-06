import { CognitoUserPool } from 'amazon-cognito-identity-js';

const poolData = {
  UserPoolId: 'eu-central-1_0BD9dkczf',
  ClientId: '57n0lrrb89m1hbq26pe2qe5d4c',
};

export default new CognitoUserPool(poolData);
