import React, { createContext } from 'react';
import AWS from 'aws-sdk';
import { CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';
import Pool from '../UserPool';
import { useNavigate } from 'react-router-dom';

const cognito = new AWS.CognitoIdentityServiceProvider({
  region: 'eu-central-1',
});
const AccountContext = createContext();

const Account = props => {
  let navigate = useNavigate();
  const getSession = async () =>
    await new Promise((resolve, reject) => {
      const user = Pool.getCurrentUser();
      if (user) {
        user.getSession(async (err, session) => {
          if (err) {
            reject();
          } else {
            const attributes = await new Promise((resolve, reject) => {
              user.getUserAttributes((err, attributes) => {
                if (err) {
                  if (err.code.match(/UserNotFoundException/)) {
                    navigate('/signin');
                  } else {
                    reject(err);
                  }
                } else {
                  const results = {};

                  for (let attribute of attributes) {
                    const { Name, Value } = attribute;
                    results[Name] = Value;
                  }

                  resolve(results);
                }
              });
            });

            const accessToken = session.accessToken.jwtToken;

            const mfaEnabled = await new Promise(resolve => {
              cognito.getUser(
                {
                  AccessToken: accessToken,
                },
                (err, data) => {
                  if (err) resolve(false);
                  else
                    resolve(
                      data.UserMFASettingList &&
                        data.UserMFASettingList.includes('SOFTWARE_TOKEN_MFA')
                    );
                }
              );
            });

            const token = session.getIdToken().getJwtToken();

            resolve({
              user,
              accessToken,
              idTokenCode: token,
              mfaEnabled,
              headers: {
                'x-api-key': attributes['custom:apikey'],
                Authorization: token,
              },
              attributes,
              ...session,
            });
          }
        });
      } else {
        reject();
      }
    });

  const authenticate = async (Username, Password) =>
    await new Promise((resolve, reject) => {
      const user = new CognitoUser({ Username, Pool });
      const authDetails = new AuthenticationDetails({ Username, Password });

      user.authenticateUser(authDetails, {
        onSuccess: data => {
          console.log('onSuccess:', data);
          resolve(data);
        },

        onFailure: err => {
          console.error('onFailure:', err);
          reject(err);
        },

        newPasswordRequired: data => {
          console.log('newPasswordRequired:', data);
          resolve(data);
        },

        mfaSetup: () => {},

        totpRequired: () => {
          const token = prompt('Please enter your 6-digit token');
          user.sendMFACode(
            token,
            {
              onSuccess: () => (window.location.href = window.location.href),
              onFailure: () => alert('Incorrect code!'),
            },
            'SOFTWARE_TOKEN_MFA'
          );
        },
      });
    });

  const logout = () => {
    const user = Pool.getCurrentUser();
    if (user) {
      user.signOut();
    }
  };

  return (
    <AccountContext.Provider
      value={{
        authenticate,
        getSession,
        logout,
      }}>
      {props.children}
    </AccountContext.Provider>
  );
};

export { Account, AccountContext };
