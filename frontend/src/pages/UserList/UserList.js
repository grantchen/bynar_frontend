import React, { useState, useEffect, useContext } from 'react';
import AWS from 'aws-sdk'
import { useNavigate } from "react-router-dom";
import UserPool from "../../UserPool";
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

    useEffect(() => {
      getSession().then(({ user, accessToken, idTokenCode, headers, attributes }) => {

        
      });
        
    }, []);

  return (
        <DataTable
            headers={[
                {
                header: 'Name',
                key: 'name'
                },
                {
                header: 'E-mail',
                key: 'email'
                },
                {
                header: 'Country',
                key: 'address'
                },
                {
                header: 'E-mail Verified',
                key: 'email_verified'
                },
            ]}
            rows={usersData}
            >
{({ rows, headers, getHeaderProps, getTableProps }) => (
    <TableContainer title="Users">
        <TableToolbar>
            <TableToolbarSearch />
        </TableToolbar>
      <Table {...getTableProps()}>
        <TableHead>
          <TableRow>
            {headers.map((header) => (
              <TableHeader {...getHeaderProps({ header, isSortable: true })}>
                {header.header}
              </TableHeader>
            ))}
          </TableRow>
        </TableHead>
        {(
            loading ? 
            (
                <InlineLoading description="Loading Users..." />
            ) 
            : 
            (
                <TableBody>
                    {rows.map((row) => (
                        <TableRow key={row.id}>
                        {row.cells.map((cell) => 

                        (cell.value == 'true' || cell.value == 'false') ? 
                        (
                            <TableCell key={cell.id}>{cell.value == 'true' ? (<CheckmarkOutline />) : (<MisuseOutline />)}</TableCell>
                        )
                        :
                        (
                            <TableCell key={cell.id}>{cell.value}</TableCell>
                        )
                        )}
                        </TableRow>
                    ))}
                </TableBody>
            )
        )}
        
      </Table>
    </TableContainer>
  )}
            </DataTable>
  );
};

export default UserList;