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
  Pagination
} from "@carbon/react";
import { RemoveModal } from '@carbon/ibm-products';
import {
  OverflowMenu,
  OverflowMenuItem
} from 'carbon-components-react';
import { useEffect, useState, useContext } from "react";
import { BaseURL, AuthContext } from "../../sdk";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { EditUser } from "../EditUser";
import { Edit20, Restart20, Restart16 } from "@carbon/icons-react";
import "./UserList.scss";
export const UserList = ({ isOpen }) => {
  const token = localStorage.getItem("token");
  const location = useLocation();

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
  const [_, setSearchParams] = useSearchParams();
  const [userList, setUserList] = useState([])
  const queryParams = new URLSearchParams(location);
  const [searchValue, setSearchValue] = useState(queryParams.get('search') || '');
  const [sortColumn, setSortColumn] = useState(queryParams.get('sortByColumn') || '');
  const [sortDirection, setSortDirection] = useState(queryParams.get('sortByOrder') || '');
  const [totalRowCount, setRowCount] = useState(0);
  const [pageSize, setPageSize] = useState(queryParams.get('page') || 0);
  const [pageLimit, setPageLimit] = useState(queryParams.get('limit') || 10);
  
  
  
  
  const getUserList = async (props) => {
    try {
      setLoading(true);
      // const queryParams = new URLSearchParams(filters)
      const response = await fetch(`${BaseURL}/list-users?${props.filters}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      if (response.ok) {
        const res = await response.json();
        const result = res?.result?.userAccountDetails.map((value, index) => ({
          ...value,
          disabled: !value?.canDelete,
          isEditable: value?.canUpdate
        }));
        setUserList(result)
        setRow(result);
        setRowCount(res?.result?.totalCount)
        navigate(`/home/dashboard?${props.filters}`)
      } else if (response.status === 500) {
      }
      setLoading(false);
    } catch (e) {
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
    if (serverNotification) {
      const query = new URLSearchParams();
      if (searchValue) query.set('search', searchValue);
      if (sortColumn) query.set('sortByColumn', sortColumn);
      if (sortDirection) query.set('sortByOrder', sortDirection.toLowerCase());
      if (pageSize) query.set('page', pageSize);
      if (pageLimit) query.set('limit', pageLimit)
      getUserList({ filters: query.toString() })
    }
  }, [serverNotification]);

  useEffect(() => {
    setIsEdit(false);
    setIsDelete(false);
    if (!isOpen) {
      setServerErrorNotification({});
      setServerNotification(false);
    } else {
      const query = new URLSearchParams();
      if (searchValue) query.set('search', searchValue);
      if (sortColumn) query.set('sortByColumn', sortColumn);
      if (sortDirection) query.set('sortByOrder', sortDirection.toLowerCase());
      if (pageSize) query.set('page', pageSize);
      if (pageLimit) query.set('limit', pageLimit)
      getUserList({ filters: query.toString() })
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

  const handleSort = (val1, val2, sortConfig) => {
    // const { key, sortDirection } = sortConfig;
    // setSortColumn(key);
    // setSortDirection(sortDirection);
  }

  const handlePageChange = (e) => {
    setPageSize(e?.page - 1);
    setPageLimit(e?.pageSize);
  }

  useEffect(() => {
    // update the URL when the searchValue, sortColumn or sortDirection changes
    const query = new URLSearchParams();
    if (searchValue) query.set('search', searchValue);
    if (sortColumn) query.set('sortByColumn', sortColumn);
    if (sortDirection) query.set('sortByOrder', sortDirection.toLowerCase());
    if (pageSize) query.set('page', pageSize);
    if (pageLimit) query.set('limit', pageLimit)
    getUserList({ filters: query.toString() })
  }, [searchValue, sortColumn, sortDirection, pageSize, pageLimit]);

  


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
            <DataTable rows={rows} headers={headers} isSortable sortRow={(val1, val2, sortConfig) => {
              handleSort(val1, val2, sortConfig)
            }} >
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
                      // onChange={(e)=>setSearchValue(e.target.value)}
                      // value={searchValue}
                      />
                      {/* <Button
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
                      </Button> */}
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
                          <TableCell className="cds--table-column-menu">
                            <OverflowMenu aria-label="overflow-menu" align="bottom">
                              <OverflowMenuItem disabled={!userList[index]?.canUpdate }  onClick={() => { handleUserEdit(row.id) }} itemText="Edit" requireTitle />
                              <OverflowMenuItem hasDivider isDelete itemText="Delete" 
                                onClick={()=> setSearchParams({
                                  userIdToBeDeleted: row.id,
                                  userNameToBeDeleted: userList[index].username
                                })}/>
                            </OverflowMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </DataTable>
            <div
              style={{
                maxWidth: '100%'
              }}
            >
              <Pagination
                backwardText="Previous page"
                forwardText="Next page"
                itemsPerPageText="Items per page:"
                onChange={(e) => { handlePageChange(e) }}
                page={pageSize + 1}
                pageSize={pageLimit}
                pageSizes={[
                  2,
                  5,
                  10,
                  20,
                  30,
                  40,
                  50
                ]}
                size="md"
                totalItems={totalRowCount}
              />
            </div>
          </div>
        </>
      )}
    </>
  );
};
