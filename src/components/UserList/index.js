import {
    TableBatchActions,
    TableBatchAction,
    TableToolbarSearch,
    TableToolbarContent,
    ToastNotification,
    Button,
    Pagination,
} from "@carbon/react";
import {
    useDatagrid,
    useActionsColumn,
    useStickyColumn,
    useSelectRows,
    useOnRowClick,
    useDisableSelectRows,
    Datagrid,
    pkg,
} from "@carbon/ibm-products";
import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import {
    useUserManagement,
    mergeQueryParams,
    getAutoSizedColumnWidth,
} from "../../sdk";
import { useSearchParams } from "react-router-dom";
import { Restart16, Activity16, Add16, TrashCan16 } from "@carbon/icons-react";
import "./UserList.scss";
import { useTranslation } from "react-i18next";
pkg.component.Datagrid = true;
// pkg.feature.Datagrid = true
// pkg.feature['Datagrid.useActionsColumn'] = true

export const UserList = ({isOpen}) => {
    const {
        getUserList,
        userListData,
        loading,
        openDeleteModal,
        notification,
        openEditPanel,
        openAddUserModel,
        openUserDetails,
        openBulkDeleteConfirmModal,
    } = useUserManagement();

    const {t} = useTranslation()
    const [searchParams, setSearchParams] = useSearchParams();

    const [searchText, setSearchText] = useState(
        searchParams.get("search") ?? ""
    );

    const skipOnMount = useRef(true);

    const getColumns = (rows) => {
        return [
            {
                Header: t("username"),
                accessor: "username",
                width: getAutoSizedColumnWidth(rows, "username", "Username"),
            },
            {
                Header: t("fullname"),
                accessor: "fullName",
                width: getAutoSizedColumnWidth(rows, "fullName", "Fullname"),
            },
            {
                Header: t("country"),
                accessor: "country",
                width: getAutoSizedColumnWidth(rows, "country", "Country"),
            },
            {
                Header: t("city"),
                accessor: "city",
                width: getAutoSizedColumnWidth(rows, "city", "City"),
            },
            {
                Header: t("postal-code"),
                accessor: "postalCode",
                width: getAutoSizedColumnWidth(rows, "postalCode", "PostalCode"),
            },
            {
                Header: t("state"),
                accessor: "state",
                width: getAutoSizedColumnWidth(rows, "state", "State"),
            },
            {
                Header: t("phone-number"),
                accessor: "phoneNumber",
                width: getAutoSizedColumnWidth(rows, "phoneNumber", "Phonenumber"),
            },
            {
                Header: t("roles"),
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
        if(!isOpen){
            return
        }
        (async () => {
            await getUserList(getUserAPIQuery());
        })();
    }, [searchParams, getUserAPIQuery, isOpen]);

    useEffect(() => {
        if(!isOpen){
            return
        }
        if (!skipOnMount.current) {
            const timeoutId = setTimeout(() => {
                (async () => {
                    if (searchText) {
                        setSearchParams({ isUserListOpen: true });
                        await getUserList({ search: searchText });
                    } else {
                        await getUserList({});
                    }
                })();
            }, 300);
            return () => clearTimeout(timeoutId);
        }
        skipOnMount.current = false
    }, [searchText, isOpen]);
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
            endPlugins: [useDisableSelectRows],
            onRowSelect: (row, event) => {},
            shouldDisableSelectRow: (row) => !row?.original?.canDelete,
            // onSort: (sortByColumn, sortByOrder) => {
            //     if(sortByOrder === 'none'){
            //         const {sortByColumn: sBC, sortByOrder: sBO, ...rest} = searchParams
            //         setSearchParams(rest)
            //     }
            //     else{
            //         setSearchParams({...searchParams, sortByColumn, sortByOrder})
            //     }
            // },
            onRowClick: ({ original }) => {
                openUserDetails({ userIdToShowDetails: original.id });
            },
            rowActions: [
                {
                    id: "edit",
                    itemText: t('edit'),
                    onClick: (_, { original }) =>
                        openEditPanel({
                            userIdToBeEdited: original.id,
                        }),
                    shouldDisableMenuItem: ({ original }) =>
                        !original.canUpdate,
                },
                {
                    id: "hidden",
                    itemText: "Hidden item",
                    onClick: () => {},
                    shouldHideMenuItem: () => true,
                },
                {
                    id: "delete",
                    itemText: t('delete'),
                    hasDivider: true,
                    isDelete: true,
                    shouldDisableMenuItem: ({ original }) =>
                        !original.canDelete,
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
                        placeHolderText={"Search here"}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                    <Button
                        kind="ghost"
                        hasIconOnly
                        tooltipPosition="bottom"
                        renderIcon={Restart16}
                        iconDescription={t('refresh')}
                        onClick={() => getUserList(getUserAPIQuery())}
                    />
                    <Button
                        onClick={openAddUserModel}
                        size="sm"
                        kind="primary"
                        style={{ cursor: "pointer" }}
                    >
                        {t('add-new-user')}
                    </Button>
                </TableToolbarContent>
            ),
            batchActions: true,
            toolbarBatchActions: [
                {
                    label: t("delete"),
                    renderIcon: TrashCan16,
                    onClick: () => {
                        const idsToDelete = datagridState.selectedFlatRows.map(
                            (row) => row.original.id
                        );
                        openBulkDeleteConfirmModal({
                            userIdsToBeDeleted: idsToDelete,
                        });
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

