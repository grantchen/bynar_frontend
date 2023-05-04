
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
import { useNavigate ,useSearchParams} from 'react-router-dom';
import './UserList.scss'
import { EditUser } from '../EditUser/EditUser';
import { SidePanels } from '../../Components/SidePanel/SidePanels';
// import { ToastNotification } from "@carbon/react";

export const UserList = ({isOpen}) => {

    const token = localStorage.getItem('token');

    const navigate = useNavigate();
    const [isDelete, setIsDelete] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [loading, setLoading] = useState(false);
    const authContext = useContext(AuthContext)
    const [rows, setRow] = useState([]);
    const [userDetails, setUserDetails] = useState({});
    const [isUserDetailEdit, setIsEditUserDetail] = useState(false);
    const [serverErrorNotification, setServerErrorNotification] = useState({})
    const [serverNotification, setServerNotification] = useState(false);
    const [addUserPanelOpen, setIsAddUserPanel] = useState(false)
    const [searchParams] = useSearchParams();
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
            else if (response.status === 500) {

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
            // debugger;
            setLoading(true);
            // const token1 = "eyJraWQiOiJ3SGw5Yzg5cDhnQW80MlVSdVBYZW9CT1wvcVk5Y3ZobGNTWXBxbUlpXC9JQ2s9IiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiJlNWIwN2EwYi04YzAwLTQwZDktYjZlMC01ZjNiMDM3M2U1YzciLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAuZXUtY2VudHJhbC0xLmFtYXpvbmF3cy5jb21cL2V1LWNlbnRyYWwtMV9JV2JoN0JMcnoiLCJjbGllbnRfaWQiOiIxYm1wNjZiMjM1MnMzYzBic2xsOGM1cWZkOSIsIm9yaWdpbl9qdGkiOiIyNjBjZjA4OC1lMzc3LTQ5YTktYWY2OS1jZDMxZDkxYmI2ZGUiLCJldmVudF9pZCI6ImY1NGFjM2EwLThmMWQtNGY1OS1hOTE4LTM5YTQyNzY2NzVjOCIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoiYXdzLmNvZ25pdG8uc2lnbmluLnVzZXIuYWRtaW4iLCJhdXRoX3RpbWUiOjE2ODAxNTE0MTksImV4cCI6MTY4MDE1NTAxOSwiaWF0IjoxNjgwMTUxNDIwLCJqdGkiOiJlOWE0YzNjYi0yYjI0LTQyZjEtOTI3My01YjdkM2U0YjgxMzAiLCJ1c2VybmFtZSI6ImU1YjA3YTBiLThjMDAtNDBkOS1iNmUwLTVmM2IwMzczZTVjNyJ9.XZlNtiXP3a5zDs5tBZr-jIniVSoago8MizEdeng_UIIWAMr9FI5I7_bRrcKhjdTEA3AWPAy4FgD8-zJBpFB5VzDs78h73EtTEpzxhzpxC1zEpW7FD6WuF31GfT5afAGA4eM9u2vRyJo_M2DoJnE0vDLG7ogk124r0dWBuGN8CnRGsTqdXUCrPnvV5MmxItefehfxFIU5yvORfXxgt8gv9PliEagXirRm2d_y2TvuL4VzJ1p4EvbGw7kCABjKFd9qlxAjbXCNjpFp7rwYcjwmSDSXRA-3EO_CLXP2ANUcXdlTwt5tFleCYXGUcAT71v2u0rhDhcNFYb4G7mwKxHuwvg"
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
                setServerErrorNotification({ message: 'User deleted sucessfully', status: 'success' })
                setIsDelete(false)
                setIsEdit(false)
            }
            else if (response.status === 500) {
                setServerNotification(true);
                setServerErrorNotification({ message: 'Error deleting user', status: 'error' })
            }
            getUserList();
            // setLoading(false);
        }
        catch (e) {
            setLoading(false);
            await authContext.signout();

        }
    }


    useEffect(async () => {
        let isMounted = true;
        try {
            setLoading(true);
            const response = await fetch(`${BaseURL}/list-users`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
            })


            if (response.ok && isMounted) {
                const res = await response.json();
                setRow(res?.result);
            }
            else if (response.status === 500) {

            }
            setLoading(false);
        }
        catch (e) {
            await authContext.signout();
            setLoading(false);
        }
        return () => {
            isMounted = false;
        };
    }, [])

    useEffect(async () => {
        if (serverNotification)
            getUserList();
    }, [serverNotification])

    useEffect(()=>{
        setIsEdit(false)
        setIsDelete(false)
        if(!isOpen){
            setServerErrorNotification({})
            setServerNotification(false)
        }
        else{
            getUserList();
        }
        
    },[isOpen])

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
        },
        {
            header: 'Roles',
            key:'cognitoUserGroups'
        }
    ];

    const handleUserEdit = (index) => {

        const userEditArray = rows?.filter(a => a.id === index);
        navigate(`/home/dashboard?editUser=true&&Id=${index}`)
        // console.log("id is ", index)
        // setUserDetails(userEditArray[0]);
        // setServerNotification(false);
        //  setIsEditUserDetail(true);
    }

    const handleDelete = (selectedRows) => {
        const tempArray = selectedRows.map(a => a.id);
        let filteredOrganisationId = rows?.filter(person => tempArray.includes(person.id)).map(a => a.id);
        deleteUser(filteredOrganisationId);
    }

    const handleAddUser = () => {
        navigate('/home/dashboard?addUser=true')
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
                                <EditUser userDetails={userDetails} setIsEditUserDetail={setIsEditUserDetail} setServerNotification={setServerNotification} setServerErrorNotification={setServerErrorNotification} />
                            </div>
                        ) : (
                            <>
                                {serverNotification ? (
                                    <div className='notification-box'>
                                        <ToastNotification
                                            iconDescription="describes the close button"
                                            subtitle={serverErrorNotification?.message}
                                            timeout={0}
                                            title={""}
                                            kind={serverErrorNotification?.status}
                                        />
                                    </div>
                                ) :
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
                                                            onClick={handleAddUser}
                                                            size="sm"
                                                            kind="primary"
                                                            style={{cursor:'pointer'}}
                                                        >
                                                            Add new user
                                                        </Button>
                                                        <Button
                                                            className="button"
                                                            tabIndex={getBatchActionProps().shouldShowBatchActions ? -1 : 0}
                                                            onClick={() => setIsDelete(!isDelete)}
                                                            size="sm"
                                                            kind="primary"
                                                            disabled={rows?.length === 0 ? true : false}
                                                            style={{cursor:'pointer'}}
                                                        >
                                                            {isDelete ? "Cancel Delete" : "Delete User"}
                                                        </Button>
                                                        <Button
                                                            className="button"
                                                            tabIndex={getBatchActionProps().shouldShowBatchActions ? -1 : 0}
                                                            onClick={() => setIsEdit(!isEdit)}
                                                            size="sm"
                                                            kind="primary"
                                                            disabled={rows?.length === 0 ? true : false}
                                                            style={{cursor:'pointer'}}
                                                        >
                                                            {isEdit ? "Cancel Edit" : "Edit User"}
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
                                                                {isDelete && <TableSelectRow className={!row.canDelete ? 'edit-icon' : 'edit-icon-disabled'} {...getSelectionProps({ row })} />}
                                                                {row.cells.map((cell) => (
                                                                    <TableCell key={cell.id}>{cell.value}</TableCell>

                                                                ))}
                                                                {isEdit && <TableCell className={!row.canUpdate ? 'edit-icon' : 'edit-icon-disabled'} onClick={() => { handleUserEdit(row.id) }}>{<Edit20 />}</TableCell>}
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
            {/* {<SidePanels/>} */}
        </>
    )
}