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
  TableToolbarContent,
  TableSelectAll,
  TableSelectRow,
  ToastNotification,
  Button,
  InlineLoading,
  ButtonSet,
} from "@carbon/react";
import { useEffect, useState, useContext } from "react";
import { BaseURL, AuthContext } from "../../sdk";
import { useNavigate, useSearchParams } from "react-router-dom";
import { EditUser } from "../EditUser";
import { Edit20, Restart20, Restart16 } from "@carbon/icons-react";
import "./UserList.scss";
export const UserList = ({ isOpen }) => {
  const token = localStorage.getItem("token");

  const navigate = useNavigate();
  const [isDelete, setIsDelete] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const authContext = useContext(AuthContext);
  const [rows, setRow] = useState([]);
  const [userDetails, setUserDetails] = useState({});
  const [isUserDetailEdit, setIsEditUserDetail] = useState(false);
  const [serverErrorNotification, setServerErrorNotification] = useState({});
  const [serverNotification, setServerNotification] = useState(false);
  const [addUserPanelOpen, setIsAddUserPanel] = useState(false);
  const [searchParams] = useSearchParams();
  const [userList, setUserList] = useState([])
  const getUserList = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BaseURL}/list-users`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });

      if (response.ok) {
        const res = await response.json();
        console.log(res);
        const result = res?.result?.userAccountDetails.map((value, index) => ({
          ...value,
          disabled: !value?.canDelete,
          isEditable: value?.canUpdate
        }));
        console.log(result);
        setUserList(result)
        setRow(result);
      } else if (response.status === 500) {
      }
      setLoading(false);
    } catch (e) {
      console.log(e)
      await authContext.signout();
      setLoading(false);
    }
  };

  const deleteUser = async (filteredOrganisationId) => {
    try {
      setLoading(true);
      const response = await fetch(`${BaseURL}/user`, {
        method: "DELETE",
        body: JSON.stringify({ accountIDs: filteredOrganisationId }),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      const res = await response.json();
      if (response.ok) {
        setServerNotification(true);
        setServerErrorNotification({
          message: "User deleted sucessfully",
          status: "success",
        });
        setIsDelete(false);
        setIsEdit(false);
      } else if (response.status === 500) {
        setServerNotification(true);
        setServerErrorNotification({
          message: "Error deleting user",
          status: "error",
        });
      }
      getUserList();
      // setLoading(false);
    } catch (e) {
      setLoading(false);
      await authContext.signout();
    }
  };


  useEffect(async () => {
    if (serverNotification) getUserList();
  }, [serverNotification]);

  useEffect(() => {
    setIsEdit(false);
    setIsDelete(false);
    if (!isOpen) {
      setServerErrorNotification({});
      setServerNotification(false);
    } else {
      getUserList();
    }
  }, [isOpen]);

  const headers = [
    {
      header: "Username",
      key: "username",
    },
    {
      header: "Fullname",
      key: "fullName",
    },
    {
      header: "Country",
      key: "country",
    },
    {
      header: "City",
      key: "city",
    },
    {
      header: "PostalCode",
      key: "postalCode",
    },
    {
      header: "State",
      key: "state",
    },
    {
      header: "Phonenumber",
      key: "phoneNumber",
    },
    {
      header: "Roles",
      key: "cognitoUserGroups",
    },
  ];

  const handleUserEdit = (index) => {
    const userEditArray = rows?.filter((a) => a.id === index);
    navigate(`/home/dashboard?editUser=true&&Id=${index}`);
  };

  const handleDelete = (selectedRows) => {
    const tempArray = selectedRows.map((a) => a.id);
    let filteredOrganisationId = rows
      ?.filter((person) => tempArray.includes(person.id))
      .map((a) => a.id);
    deleteUser(filteredOrganisationId);
  };

  const handleAddUser = () => {
    navigate("/home/dashboard?addUser=true");
  };

  const handleSort=(value,e)=>{
    console.log("test",value,e.target.value)
  }


  return (
    <>
      {loading ? (
        <div
          style={{
            paddingTop: "20%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <InlineLoading
            style={{ maxWidth: "fit-content" }}
            description="Loading..."
          />
        </div>
      ) : (
        <>
          {serverNotification && (
            <ToastNotification
              className="error-notification-box"
              iconDescription="describes the close button"
              subtitle={serverErrorNotification?.message}
              timeout={0}
              title={""}
              kind={serverErrorNotification?.status}
            />
          )}
          <div className="userdata-table">
            <DataTable rows={rows} headers={headers} isSortable  sortDirection={'ASC'} sortRow={(e)=>{console.log(e)}} >
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
                        tabIndex={
                          getBatchActionProps().shouldShowBatchActions
                            ? 0
                            : -1
                        }
                        onClick={() => {
                          handleDelete(selectedRows);
                        }}
                      >
                        Delete
                      </TableBatchAction>
                    </TableBatchActions>
                    <TableToolbarContent>
                      <TableToolbarSearch
                        tabIndex={
                          getBatchActionProps().shouldShowBatchActions
                            ? -1
                            : 0
                        }
                        onChange={(e)=>console.log(e.target.value,"search")}
                      />
                      <Button
                        kind='ghost'
                        tabIndex={
                          getBatchActionProps().shouldShowBatchActions
                            ? -1
                            : 0
                        }
                        onClick={() => { getUserList() }}
                        renderIcon={Restart16}
                        size="sm"
                        style={{ cursor: "pointer" }}
                        aria-label="Refresh"
                      >
                      </Button>
                      <ButtonSet>
                        <Button
                          tabIndex={
                            getBatchActionProps().shouldShowBatchActions
                              ? -1
                              : 0
                          }
                          onClick={handleAddUser}
                          size="sm"
                          kind="primary"
                          style={{ cursor: "pointer" }}
                        >
                          Add new user
                        </Button>
                      </ButtonSet>
                    </TableToolbarContent>
                  </TableToolbar>
                  <Table>
                    <TableHead>
                      <TableRow>
                        {(
                          <TableSelectAll {...getSelectionProps()} />
                        )}
                        {headers.map((header) => (
                          <TableHeader
                            {...getHeaderProps({
                              header,
                              // isSortable:true
                            })}
                            //  onClick={(e) => handleSort(header.key,e)}
                          >
                            {header.header}
                          </TableHeader>
                        ))}
                        {<TableHeader />}
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {rows.map((row, index) => (
                        <TableRow {...getRowProps({ row })}>
                          {(
                            <TableSelectRow
                              className={"edit-icon"}
                              {...getSelectionProps({ row })}
                            />
                          )}
                          {row.cells.map((cell) => (
                            <TableCell key={cell.id}>
                              {cell.value}
                            </TableCell>
                          ))}
                          {
                            <TableCell
                              className={userList[index].canUpdate ? "edit-icon" : "edit-icon-disabled"}
                              onClick={userList[index].canUpdate ? () => { handleUserEdit(row.id) } : null}
                            >
                              {<Edit20 />}
                            </TableCell>
                          }
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </DataTable>
          </div>
        </>
      )}
    </>
  );
};
