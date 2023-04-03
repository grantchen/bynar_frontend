
import {
    DataTable,
    Table,
    TableHead,
    TableRow,
    TableHeader,
    TableBody,
    TableCell,
    TableContainer,
    TableToolbar,
    TableBatchActions,
    TableBatchAction,
    TableToolbarSearch,
    TableToolbarMenu,
    TableToolbarContent,
    TableToolbarAction,
    TableSelectAll,
    TableSelectRow,
    ToastNotification
} from 'carbon-components-react';
import {
   Edit20
} from '@carbon/icons-react';
import {
    Form,
    Button,
    Heading,
} from '@carbon/react';
import { useEffect, useState, useContext } from 'react';
import { BaseURL } from '../../sdk/constant';
import { AuthContext } from '../../sdk/context/AuthContext';
import { DataLoader } from '../../Components/Loader/DataLoder';
import { useNavigate } from 'react-router-dom';
import './UserList.scss'
import { EditUser } from '../EditUser/EditUser';
// import { ToastNotification } from "@carbon/react";

export const UserList = () => {

    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    const [isDelete, setIsDelete] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [loading, setLoading] = useState(false);
    const authContext = useContext(AuthContext)
    const [rows, setRow] = useState([]);
    const [userDetails, setUserDetails] = useState({});
    const [isUserDetailEdit, setIsEditUserDetail] = useState(false);
    const [serverErrorNotification,setServerErrorNotification] =useState({}) 
    const [serverNotification,setServerNotification] =useState(false);
    const getUserList = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${BaseURL}/list-users`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
            })
            

            if (response.ok) {
                const res = await response.json();
                setRow(res?.result);
            }
            else if(response.status === 500){

            }
            setLoading(false);
        }
        catch (e) {
            await authContext.signout();
            setLoading(false);
        }
    }

    const deleteUser = async (filteredOrganisationId) => {
        try {
            setLoading(true);
            const response = await fetch(`${BaseURL}/user`, {
                method: 'DELETE',
                body: JSON.stringify({ accountIDs: filteredOrganisationId }),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
            })
           
            const res = await response.json();
            if (response.ok) {
             setServerNotification(true);
             setServerErrorNotification({message:'User deleted sucessfully',status:'success'})
            }
            else if (response.status === 500) {
                setServerNotification(true);
                setServerErrorNotification({message:'Error deleting user',status:'error'})
            }
            getUserList();
            // setLoading(false);
        }
        catch (e) {
            setLoading(false);
            // await authContext.signout();

        }
    }


    useEffect(async () => {
        getUserList();
    }, [])

    useEffect(async () => {
        if(serverNotification)
        getUserList();
    }, [serverNotification])

    const headers = [
        {
            header: 'Username',
            key: 'username'
        },
        {
            header: 'Fullname',
            key: 'fullName'
        },
        {
            header: 'Country',
            key: 'country'
        },
        {
            header: 'City',
            key: 'city'
        },
        {
            header: 'PostalCode',
            key: 'postalCode'
        },
        {
            header: 'State',
            key: 'state'
        },
        {
            header: 'Phonenumber',
            key: 'phoneNumber'
        }
    ];

    const handleUserEdit = (index) => {

        const userEditArray=rows?.filter(a => a.id === index);
        console.log(userEditArray[0]);
        setUserDetails(userEditArray[0]);
        setServerNotification(false);
         setIsEditUserDetail(true);
    }

    const handleDelete = (selectedRows) => {
        const tempArray = selectedRows.map(a => a.id);
        let filteredOrganisationId = rows?.filter(person => tempArray.includes(person.id)).map(a => a.id);
        deleteUser(filteredOrganisationId);
    }
    return (
        <>
            {loading ? (
                <div className='loader-page'>
                    <DataLoader />
                </div>)
                :
                (
                    <>
                        {isUserDetailEdit ? (
                            <div>
                                <EditUser userDetails={userDetails} setIsEditUserDetail={setIsEditUserDetail} setServerNotification={setServerNotification} setServerErrorNotification={setServerErrorNotification}/>
                            </div>
                        ) : (
                            <>
                            {serverNotification?(
                                <div  className='notification-box'>
                                <ToastNotification
                                iconDescription="describes the close button"
                                subtitle={serverErrorNotification?.message}
                                timeout={0}
                                title={""}
                                kind={serverErrorNotification?.status}
                              />
                              </div>
                            ):
                            (
                            <div className='notification-box'>

                            </div>
                            )}
                            <div className='userdata-table'>
                                <DataTable rows={rows} headers={headers}>
                                    {({
                                        rows,
                                        headers,
                                        getHeaderProps,
                                        getRowProps,
                                        getSelectionProps,
                                        getBatchActionProps,
                                        onInputChange,
                                        selectedRows,
                                    }) => (
                                        <TableContainer>
                                            <TableToolbar>
                                                <TableBatchActions {...getBatchActionProps()}>
                                                    <TableBatchAction
                                                        tabIndex={getBatchActionProps().shouldShowBatchActions ? 0 : -1}
                                                        onClick={() => { handleDelete(selectedRows) }}
                                                    >
                                                        Delete
                                                    </TableBatchAction>
                                                </TableBatchActions>
                                                <TableToolbarContent>
                                                    <TableToolbarSearch
                                                        tabIndex={getBatchActionProps().shouldShowBatchActions ? -1 : 0}
                                                        onChange={onInputChange}
                                                    />
                                                    <Button
                                                        className="button"
                                                        tabIndex={getBatchActionProps().shouldShowBatchActions ? -1 : 0}
                                                        onClick={() => navigate('/adduser')}
                                                        size="sm"
                                                        kind="primary"
                                                    >
                                                        Add new user
                                                    </Button>
                                                    <Button
                                                        className="button"
                                                        tabIndex={getBatchActionProps().shouldShowBatchActions ? -1 : 0}
                                                        onClick={() => setIsDelete(!isDelete)}
                                                        size="sm"
                                                        kind="primary"
                                                        disabled={rows?.length ===0 ? true: false}
                                                    >
                                                       {isDelete ? "Cancel Delete" :"Delete User"} 
                                                    </Button>
                                                    <Button
                                                        className="button"
                                                        tabIndex={getBatchActionProps().shouldShowBatchActions ? -1 : 0}
                                                        onClick={() => setIsEdit(!isEdit)}
                                                        size="sm"
                                                        kind="primary"
                                                        disabled={rows?.length ===0 ? true: false}
                                                    >
                                                         {isEdit ? "Cancel Edit" :"Edit User"} 
                                                    </Button>
                                                </TableToolbarContent>
                                            </TableToolbar>
                                            <Table>
                                                <TableHead>
                                                    <TableRow>
                                                        {isDelete && <TableSelectAll {...getSelectionProps()} />}
                                                        {headers.map((header) => (

                                                            <TableHeader  {...getHeaderProps({ header, isSortable: true })}>
                                                                {header.header}
                                                            </TableHeader>
                                                        ))}
                                                        {isEdit && <TableHeader />}

                                                    </TableRow>
                                                </TableHead>

                                                <TableBody>
                                                    {rows.map((row, index) => (
                                                        <TableRow {...getRowProps({ row })}>
                                                            {isDelete && <TableSelectRow {...getSelectionProps({ row })} />}
                                                            {row.cells.map((cell) => (
                                                                <TableCell key={cell.id}>{cell.value}</TableCell>

                                                            ))}
                                                            {isEdit && <TableCell style={{cursor:'pointer'}} onClick={() => { handleUserEdit(row.id) }}>{<Edit20/>}</TableCell>}
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    )}
                                </DataTable>
                            </div>
                            </>
                            )
                            
                        }
                    </>
                )
            }
        </>
    )
}