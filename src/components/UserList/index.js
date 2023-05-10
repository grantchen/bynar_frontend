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
    Pagination,
} from "@carbon/react";
import {
    RemoveModal,
    useDatagrid,
    useActionsColumn,
    useStickyColumn,
    useSelectRows,
    useOnRowClick,
    useSortableColumns,
    Datagrid,
    pkg,
} from "@carbon/ibm-products";
import { OverflowMenu, OverflowMenuItem } from "carbon-components-react";
import { useEffect, useState, useContext, useCallback, useMemo } from "react";
import {
    BaseURL,
    AuthContext,
    useUserManagement,
    mergeQueryParams,
    getAutoSizedColumnWidth,
} from "../../sdk";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { EditUser } from "../EditUser";
import {
    Edit20,
    Restart20,
    Restart16,
    Activity16,
    Add16,
} from "@carbon/icons-react";
import "./UserList.scss";
pkg.component.Datagrid = true;
export const UserList = () => {
    const {
        getUserList,
        userListData,
        loading,
        openDeleteModal,
        notification,
        openEditPanel,
        openAddUserModel,
        openUserDetails,
        openBulkDeleteConfirmModal
    } = useUserManagement();

    const [searchParams, setSearchParams] = useSearchParams();

    const [searchText, setSearchText] = useState(searchParams.get('search') ?? '')

    const { page, pageLimit } = useMemo(() => {
        let values = {
            page: 0,
            pageLimit: 10,
        };
        try {
            values = {
                page: parseInt(searchParams.get("page") ?? 0),
                pageLimit: parseInt(searchParams.get("limit") ?? 10),
            };
        } catch (error) {
        } finally {
            return values;
        }
    }, [searchParams]);

    const getUserAPIQuery = useCallback(() => {
        return {
            limit: searchParams.get("limit") ?? 10,
            page: searchParams.get("page") ?? 0,
            search: searchParams.get("search") ?? "",
            sortByColumn: searchParams.get("sortByColumn"),
            sortByOrder: searchParams.get("sortByOrder"),
        };
    }, [searchParams]);

    useEffect(() => {
        (async () => {
            await getUserList(getUserAPIQuery());
        })();
    }, [searchParams, getUserAPIQuery]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            (async () => {
                if(searchText){
                    setSearchParams({isUserListOpen: true})
                    await getUserList({search: searchText});
                }
                else{
                    await getUserList({});
                }
            })()
        }, 300)
        return () => clearTimeout(timeoutId)
    }, [searchText])
    const handleSort = useCallback((val1, val2, sortConfig) => {
        setSearchParams((prev) => ({
            ...prev,
            sortByColumn: sortConfig.key,
            sortByOrder: sortConfig.sortDirection,
        }));
    }, []);
    const columns = useMemo(
        () => getColumns(userListData.userAccountDetails),
        [userListData.userAccountDetails]
    );
    const datagridState = useDatagrid(
        {
            columns,
            data: userListData.userAccountDetails,
            isFetching: loading,
            onRowSelect: (row, event) => console.log(row, event),
            // onSort: (sortByColumn, sortByOrder) => {
            //     if(sortByOrder === 'none'){
            //         const {sortByColumn: sBC, sortByOrder: sBO, ...rest} = searchParams
            //         setSearchParams(rest)
            //     }
            //     else{
            //         setSearchParams({...searchParams, sortByColumn, sortByOrder})
            //     }
            // },
            onRowClick: ({original}) => {
                openUserDetails({userIdToShowDetails: original.id})
            },
            rowActions: [
                {
                    id: "edit",
                    itemText: "Edit",
                    onClick: (_, { original }) =>
                        openEditPanel({
                            userIdToBeEdited: original.id,
                        }),
                    shouldDisableMenuItem: ({original}) => !original.canUpdate
                },
                {
                    id: "hidden",
                    itemText: "Hidden item",
                    onClick: () => {},
                    shouldHideMenuItem: () => true,
                },
                {
                    id: "delete",
                    itemText: "Delete",
                    hasDivider: true,
                    isDelete: true,
                    shouldDisableMenuItem: ({original}) => !original.canDelete,
                    onClick: (_, { original }) =>
                        openDeleteModal({
                            userIdToBeDeleted: original.id,
                            userNameToBeDeleted: original.username,
                        }),
                },
            ],
            DatagridPagination: ({ state, setPageSize, gotoPage }) => (
                <Pagination
                    page={page + 1}
                    pageSize={pageLimit}
                    pageSizes={[2, 5, 10, 25, 50]}
                    totalItems={userListData?.totalCount}
                    onChange={({ page, pageSize }) => {
                        setSearchParams((prev) => {
                            return mergeQueryParams(prev, {
                                page: page - 1,
                                limit: pageSize,
                            });
                        });
                    }}
                />
            ),
            DatagridBatchActions: ({
                selectedFlatRows,
                toggleAllRowsSelected,
            }) => {
                const totalSelected =
                    selectedFlatRows && selectedFlatRows.length;
                return (
                    <TableBatchActions
                        shouldShowBatchActions={totalSelected > 0}
                        totalSelected={totalSelected}
                        onCancel={() => toggleAllRowsSelected(false)}
                    >
                        <TableBatchAction
                            renderIcon={Activity16}
                            onClick={() => alert("Batch action")}
                        >
                            Action
                        </TableBatchAction>
                    </TableBatchActions>
                );
            },
            DatagridActions: () => (
                <TableToolbarContent>
                    <TableToolbarSearch
                        size="xl"
                        id="columnSearch"
                        persistent
                        placeHolderText={"Search here"}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                    <Button
                        kind="ghost"
                        hasIconOnly
                        tooltipPosition="bottom"
                        renderIcon={Restart16}
                        iconDescription={"Refresh"}
                        onClick={() => getUserList(getUserAPIQuery())}
                    />
                    <Button
                        onClick={openAddUserModel}
                        size="sm"
                        kind="primary"
                        style={{ cursor: "pointer" }}
                    >
                        Add new user
                    </Button>
                </TableToolbarContent>
            ),
            batchActions: true,
            toolbarBatchActions: [
                {
                    label: "Delete",
                    renderIcon: Add16,
                    onClick: () => {
                        const idsToDelete = datagridState.selectedFlatRows.map(row => row.original.id)
                        openBulkDeleteConfirmModal({userIdsToBeDeleted: idsToDelete})
                    },
                    hasDivider: true,
                    kind: "danger",
                },
            ],
        },
        useStickyColumn,
        useActionsColumn,
        useSelectRows,
        useOnRowClick,
        // useSortableColumns
    );

    return (
        <>
            <>
                {notification && (
                    <ToastNotification
                        className="error-notification-box"
                        iconDescription="close notification"
                        subtitle={notification?.message}
                        timeout={0}
                        title={""}
                        kind={notification.type}
                    />
                )}
                <div className="userdata-table">
                    <Datagrid datagridState={datagridState} />
                </div>
            </>
        </>
    );
};

const getColumns = (rows) => {
    return [
        {
            Header: "Username",
            accessor: "username",
            width: getAutoSizedColumnWidth(rows, "username", "Username"),
        },
        {
            Header: "Fullname",
            accessor: "fullName",
            width: getAutoSizedColumnWidth(rows, "fullName", "Fullname"),
        },
        {
            Header: "Country",
            accessor: "country",
            width: getAutoSizedColumnWidth(rows, "country", "Country"),
        },
        {
            Header: "City",
            accessor: "city",
            width: getAutoSizedColumnWidth(rows, "city", "City"),
        },
        {
            Header: "PostalCode",
            accessor: "postalCode",
            width: getAutoSizedColumnWidth(rows, "postalCode", "PostalCode"),
        },
        {
            Header: "State",
            accessor: "state",
            width: getAutoSizedColumnWidth(rows, "state", "State"),
        },
        {
            Header: "Phonenumber",
            accessor: "phoneNumber",
            width: getAutoSizedColumnWidth(rows, "phoneNumber", "Phonenumber"),
        },
        {
            Header: "Roles",
            accessor: "cognitoUserGroups",
            width: getAutoSizedColumnWidth(rows, "cognitoUserGroups", "Roles"),
        },
        {
            Header: "",
            accessor: "actions",
            isAction: true,
            sticky: "right",
        },
    ];
};
