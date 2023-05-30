import {
    TableBatchActions,
    TableBatchAction,
    TableToolbarSearch,
    TableToolbarContent,
    ToastNotification,
    Button,
    Pagination,
} from "@carbon/react";
import { Edit, TrashCan, DataViewAlt, Add } from "@carbon/react/icons";
import {
    useDatagrid,
    useActionsColumn,
    useStickyColumn,
    useSelectRows,
    useOnRowClick,
    useDisableSelectRows,
    // useCustomizeColumns,
    // useColumnOrder,
    Datagrid,
    // useInfiniteScroll,
    pkg,
} from "@carbon/ibm-products";
import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import {
    useUserManagement,
    mergeQueryParams,
    getAutoSizedColumnWidth,
    useSortableColumnsFork,
    SORTABLE_ORDERING,
    omitQueryParams,
    useMobile,
} from "../../sdk";
import { useSearchParams } from "react-router-dom";
import { Restart16, Activity16, TrashCan16 } from "@carbon/icons-react";

import "./UserList.scss";
import { useTranslation } from "react-i18next";

pkg.setAllComponents(true);
pkg.setAllFeatures(true);

export const UserList = ({ isOpen }) => {
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

    const isMobile = useMobile();
    const { t } = useTranslation();
    const [searchParams, setSearchParams] = useSearchParams();

    const [searchText, setSearchText] = useState(
        searchParams.get("search") ?? ""
    );

    const [isSearchBarExpanded, setIsSearchBarExpanded] = useState(false);

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
        if (isOpen) {
            searchTextChangedByEffectOnMount.current = true;
            setSearchText(searchParams.get("search") ?? "");
        }
    }, [isOpen]);
    useEffect(() => {
        if (!isOpen) {
            return;
        }
        (async () => {
            await getUserList(getUserAPIQuery());
        })();
    }, [getUserAPIQuery, isOpen]);

    const searchTextChangedByEffectOnMount = useRef(false);
    useEffect(() => {
        if (!isOpen) {
            setIsSearchBarExpanded(false);
            return;
        }
        if (searchTextChangedByEffectOnMount.current) {
            searchTextChangedByEffectOnMount.current = false;
            return;
        }
        const timeoutId = setTimeout(() => {
            (async () => {
                if (searchText) {
                    setSearchParams((prev) => {
                        const paramsWithoutPageFilters = omitQueryParams(prev, [
                            "page",
                        ]);
                        return {
                            ...paramsWithoutPageFilters,
                            search: searchText,
                        };
                    });
                } else {
                    setSearchParams((prev) =>
                        omitQueryParams(prev, ["search"])
                    );
                }
            })();
        }, 300);
        return () => clearTimeout(timeoutId);
    }, [searchText, isOpen]);

    const columns = useMemo(
        () => getColumns(userListData.userAccountDetails, t),
        [userListData.userAccountDetails]
    );

    const datagridState = useDatagrid(
        {
            columns,
            data: userListData.userAccountDetails,
            isFetching: loading,
            endPlugins: [useDisableSelectRows],
            emptyStateTitle: t("no-users"),
            emptyStateDescription: t("no-users-action-description"),
            emptyStateSize: "lg",
            emptyStateAction: {
                text: t("add-new-user"),
                onClick: openAddUserModel,
                renderIcon: Add,
                iconDescription: "Add icon",
            },
            // fetchMoreData: (...args) => console.log(args),
            // virtualHeight: window.innerHeight -318,
            // initialState: {
            //     hiddenColumns: [],
            //     columnOrder: [],
            // },
            // customizeColumnsProps: {
            //     onSaveColumnPrefs: (newColDefs) => {
            //         console.log(newColDefs);
            //     },
            //     columns
            // },
            rowActions: [
                {
                    id: "view",
                    itemText: (
                        <div className="row-action-renderer">
                            <DataViewAlt /> {t("view")}
                        </div>
                    ),
                    onClick: (_, { original }) =>
                        openUserDetails({
                            userIdToShowDetails: original.id,
                        }),
                },
                {
                    id: "edit",
                    itemText: (
                        <div className="row-action-renderer">
                            <Edit /> {t("edit")}
                        </div>
                    ),
                    onClick: (_, { original }) =>
                        openEditPanel({
                            userIdToBeEdited: original.id,
                        }),
                    shouldDisableMenuItem: ({ original }) =>
                        !original.canUpdate,
                },
                {
                    id: "delete",
                    itemText: (
                        <div className="row-action-renderer">
                            <TrashCan /> {t("delete")}
                        </div>
                    ),
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
            onRowSelect: (row, event) => {},
            shouldDisableSelectRow: (row) => !row?.original?.canDelete,
            onSort: (sortByColumn, sortByOrder) => {
                if (sortByOrder === SORTABLE_ORDERING.NONE) {
                    setSearchParams((prev) =>
                        omitQueryParams(prev, ["sortByColumn", "sortByOrder"])
                    );
                } else {
                    setSearchParams((prev) =>
                        mergeQueryParams(prev, {
                            sortByColumn,
                            sortByOrder,
                        })
                    );
                }
            },
            onRowClick: ({ original }) => {
                openUserDetails({
                    userIdToShowDetails: original.id,
                });
            },
            DatagridPagination: () => (
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
            DatagridActions: () => {
                return (
                    <TableToolbarContent>
                        <TableToolbarSearch
                            size="xl"
                            id="columnSearch"
                            className="search-input"
                            placeHolderText={"Search here"}
                            onChange={(e) => setSearchText(e.target.value)}
                            value={searchText ?? null}
                            onExpand={(_, value) =>
                                setIsSearchBarExpanded(value)
                            }
                            expanded={isSearchBarExpanded || searchText}
                            onClear={() => setSearchText("")}
                        />
                        <Button
                            kind="ghost"
                            hasIconOnly
                            tooltipPosition="bottom"
                            renderIcon={Restart16}
                            iconDescription={t("refresh")}
                            onClick={() => getUserList(getUserAPIQuery())}
                        />
                        {/* <dgState.CustomizeColumnsButton /> */}
                        <Button
                            onClick={openAddUserModel}
                            hasIconOnly={isMobile ? true : false}
                            size={isMobile ? "lg" : "sm"}
                            kind="primary"
                            style={{ cursor: "pointer" }}
                            renderIcon={Add}
                            tooltipPosition="bottom"
                            tooltipAlignment="end"
                            iconDescription={t("add-new-user")}
                        >
                            {t("add-new-user")}
                        </Button>
                    </TableToolbarContent>
                );
            },
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
        useSortableColumnsFork
        // useCustomizeColumns,
        // useColumnOrder,
        // useInfiniteScroll
    );

    /**
     * effect to set/reset datagrid states on params / tearsheet open state changes
     */
    useEffect(() => {
        if(!isOpen){
            return
        }
        datagridState.setPageSize(pageLimit);
    }, [pageLimit, isOpen]);

    useEffect(() => {
        if (!isOpen) {
            return;
        }
        const sortByColumn = searchParams.get("sortByColumn");
        const sortByOrder = searchParams.get("sortByColumn");
        if (sortByColumn && sortByOrder) {
            datagridState.setSortBy([
                {
                    id: searchParams.get("sortByColumn"),
                    desc: searchParams.get("sortByOrder") === "DESC",
                },
            ]);
        }
        else{
            datagridState.setSortBy([]);
        }
    }, [
        isOpen,
        searchParams.get("sortByColumn"),
        searchParams.get("sortByOrder"),
    ]);

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

const getColumns = (rows, t) => {
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
            disableSortBy: true,
        },
    ];
};
