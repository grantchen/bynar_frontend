import React, { useState, useEffect, useContext } from 'react';
import AWS from 'aws-sdk';
import { useNavigate } from 'react-router-dom';
import UserPool from '../../UserPool';
import {
  CognitoIdentityProviderClient,
  ListUsersCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { AccountContext } from '../../components/Accounts';

import {
  Content,
  DataTable,
  TableContainer,
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableToolbar,
  TableToolbarSearch,
  InlineLoading,
} from '@carbon/react';
import { CheckmarkOutline, MisuseOutline } from '@carbon/react/icons';

const UserList = () => {
  const { getSession } = useContext(AccountContext);

  const [loading, setLoading] = useState(true);
  const [usersData, setUsersData] = useState([]);

  function getCognitoIdentityCredentials(idToken) {
    var region = 'eu-central-1';
    AWS.config.region = region;
    var userPoolId = 'eu-central-1_0BD9dkczf';
    var identityPoolId = 'eu-central-1:4f6ce029-67bc-4a3b-8f05-01393c0b5661';

    var loginMap = {};
    loginMap[
      'cognito-idp.' + region + '.amazonaws.com/' + userPoolId
    ] = idToken;

    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
      IdentityPoolId: identityPoolId,
      Logins: loginMap,
    });

    AWS.config.credentials.clearCachedId();

    AWS.config.credentials.get(function(err) {
      if (err) {
        console.log(err.message);
      } else {
        console.log('AWS Access Key: ' + AWS.config.credentials.accessKeyId);
        console.log(
          'AWS Secret Key: ' + AWS.config.credentials.secretAccessKey
        );
        console.log(
          'AWS Session Token: ' + AWS.config.credentials.sessionToken
        );
      }

      fetchUsersData();
    });
  }

  // const client = new CognitoIdentityProviderClient({
  //     region: "eu-central-1",
  //     // credentials: fromCognitoIdentityPool({
  //     //   clientConfig: { region: "eu-central-1" }, // Configure the underlying CognitoIdentityClient.
  //     //   identityPoolId: 'eu-central-1:1546f079-c819-481a-b260-44158d99a894',
  //     //   logins: {
  //     //           // Optional tokens, used for authenticated login.
  //     //   },
  //     // })
  // });

  // // const client = new CognitoIdentityProviderClient({
  // //     region: "eu-central-1",
  // //     // credentials: {
  // //     //     // accessKeyId: process.env.YOUR_AWS_ACCESS_KEY_ID,
  // //     //     // secretAccessKey: process.env.YOUR_AWS_SECRET_ACCESS_KEY,
  // //     //     accessKeyId: 'AKIATEJNVEXTXTOUORFE',
  // //     //     secretAccessKey: 'fBHMK3p5XmUc+aWS2PGGwLk6Xj3HvxRA2MpyfNNe',
  // //     // }
  // // });

  // const command = new ListUsersCommand({
  //     UserPoolId: 'eu-central-1_0BD9dkczf'
  // });

  useEffect(() => {
    getSession().then(
      ({ user, accessToken, idTokenCode, headers, attributes }) => {
        getCognitoIdentityCredentials(idTokenCode);
      }
    );
  }, []);

  const fetchUsersData = () => {
    const client = new CognitoIdentityProviderClient({
      region: 'eu-central-1',
      credentials: {
        // accessKeyId: process.env.YOUR_AWS_ACCESS_KEY_ID,
        // secretAccessKey: process.env.YOUR_AWS_SECRET_ACCESS_KEY,
        accessKeyId: AWS.config.credentials.accessKeyId,
        secretAccessKey: AWS.config.credentials.secretAccessKey,
      },
    });

    console.log('accessKeyId: ', AWS.config.credentials.accessKeyId);
    console.log('secretAccessKey: ', AWS.config.credentials.secretAccessKey);
    const command = new ListUsersCommand({
      UserPoolId: 'eu-central-1_0BD9dkczf',
    });
    console.log('fetchUsersData');
    client.send(command).then(
      data => {
        console.log(data);
        var usersDataFormatted = [];
        if (data.Users && data.Users.length > 0) {
          data.Users.forEach(userObject => {
            var userObjectFormatted = {};
            userObject.Attributes.forEach(userAttribute => {
              userObjectFormatted[userAttribute.Name] = userAttribute.Value;
            });
            userObjectFormatted.id = userObjectFormatted.sub;
            console.log(userObjectFormatted);
            usersDataFormatted.push(userObjectFormatted);
          });
        }
        setUsersData(usersDataFormatted);
        setLoading(false);
        console.log(data);
        // process data.
      },
      error => {
        // error handling.
      }
    );
  };

  return (
    <DataTable
      headers={[
        {
          header: 'Name',
          key: 'name',
        },
        {
          header: 'E-mail',
          key: 'email',
        },
        {
          header: 'Country',
          key: 'address',
        },
        {
          header: 'E-mail Verified',
          key: 'email_verified',
        },
      ]}
      rows={usersData}>
      {({ rows, headers, getHeaderProps, getTableProps }) => (
        <TableContainer title="Users">
          <TableToolbar>
            <TableToolbarSearch />
          </TableToolbar>
          <Table {...getTableProps()}>
            <TableHead>
              <TableRow>
                {headers.map(header => (
                  <TableHeader
                    {...getHeaderProps({ header, isSortable: true })}>
                    {header.header}
                  </TableHeader>
                ))}
              </TableRow>
            </TableHead>
            {loading ? (
              <InlineLoading description="Loading Users..." />
            ) : (
              <TableBody>
                {rows.map(row => (
                  <TableRow key={row.id}>
                    {row.cells.map(cell =>
                      cell.value == 'true' || cell.value == 'false' ? (
                        <TableCell key={cell.id}>
                          {cell.value == 'true' ? (
                            <CheckmarkOutline />
                          ) : (
                            <MisuseOutline />
                          )}
                        </TableCell>
                      ) : (
                        <TableCell key={cell.id}>{cell.value}</TableCell>
                      )
                    )}
                  </TableRow>
                ))}
              </TableBody>
            )}
          </Table>
        </TableContainer>
      )}
    </DataTable>
  );
};

export default UserList;
