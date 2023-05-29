import { useTranslation } from "react-i18next";
import {
    useInvoices,
    mergeQueryParams,
    getAutoSizedColumnWidth,
    useSortableColumnsFork,
    SORTABLE_ORDERING,
    omitQueryParams,
    useMobile,
} from "../../sdk";
import { useSearchParams } from "react-router-dom";
import { TableToolbarContent, Button, Pagination } from "@carbon/react";
import { DocumentDownload, Receipt, IbmBluepay, Add } from "@carbon/react/icons";
import {
    useDatagrid,
    useActionsColumn,
    useStickyColumn,
    // useDisableSelectRows,
    // useSelectRows,
    //     useOnRowClick,
    // useCustomizeColumns,
    // useColumnOrder,
    StatusIcon,
    Datagrid,
    pkg,
} from "@carbon/ibm-products";
import { useEffect, useCallback, useMemo } from "react";
import { Restart16, Activity16, TrashCan16 } from "@carbon/icons-react";

pkg.setAllComponents(true);
pkg.setAllFeatures(true);

export default function InvoicesTable() {
    const { invoicesListData, isInvoiceListOpen, getInvoicesList, loading, payNow, downloadReceipts, downloadInvoice } =
        useInvoices();
    const isMobile = useMobile();
    const { t } = useTranslation();

    const [searchParams, setSearchParams] = useSearchParams();

    const columns = useMemo(
        () => getColumns(invoicesListData.invoices, t),
        [invoicesListData.invoices]
    );

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

    const getInvoicesAPIQuery = useCallback(() => {
        return {
            limit: searchParams.get("limit") ?? 10,
            page: searchParams.get("page") ?? 0,
            search: searchParams.get("search") ?? "",
            sortByColumn: searchParams.get("sortByColumn"),
            sortByOrder: searchParams.get("sortByOrder"),
        };
    }, [searchParams]);

    useEffect(() => {
        if (!isInvoiceListOpen) {
            return;
        }
        (async () => {
            await getInvoicesList(getInvoicesAPIQuery());
        })();
    }, [getInvoicesAPIQuery, isInvoiceListOpen]);

    const datagridState = useDatagrid(
        {
            columns,
            data: invoicesListData.invoices,
            isFetching: loading,
            endPlugins: [],
            emptyStateTitle: t("no-users"),
            emptyStateDescription: t("no-users-action-description"),
            emptyStateSize: "lg",
            rowActions: [
                {
                    id: "view",
                    itemText: (
                        <div className="row-action-renderer">
                            <IbmBluepay /> Pay
                            {/* {t("view")} */}
                        </div>
                    ),
                    onClick: (_, { original }) => payNow(original),
                },
                {
                    id: "edit",
                    itemText: (
                        <div className="row-action-renderer">
                            <DocumentDownload /> Invoice
                            {/* {t("edit")} */}
                        </div>
                    ),
                    onClick: (_, { original }) => downloadInvoice(original.id),
                    shouldDisableMenuItem: ({ original }) =>
                        !original.paid,
                },
                {
                    id: "delete",
                    itemText: (
                        <div className="row-action-renderer">
                            <Receipt /> Receipt
                            {/* {t("delete")} */}
                        </div>
                    ),
                    hasDivider: true,
                    shouldDisableMenuItem: ({ original }) =>
                    !original.paid,
                    onClick: (_, { original }) => downloadReceipts(original),
                },
            ],
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
            DatagridPagination: () => (
                <Pagination
                    page={page + 1}
                    pageSize={pageLimit}
                    pageSizes={[2, 5, 10, 25, 50]}
                    totalItems={invoicesListData?.totalCount}
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
            DatagridActions: () => {
                return (
                    <TableToolbarContent>
                        <Button
                            kind="ghost"
                            hasIconOnly
                            tooltipPosition="bottom"
                            renderIcon={Restart16}
                            iconDescription={t("refresh")}
                            onClick={() =>
                                getInvoicesList(getInvoicesAPIQuery())
                            }
                        />
                        {/* <dgState.CustomizeColumnsButton /> */}
                        {/* <Button
                            // onClick={openAddUserModel}
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
                        </Button> */}
                    </TableToolbarContent>
                );
            },
        },
        useStickyColumn,
        useActionsColumn
    );
    /**
     * effect to set/reset datagrid states on params / tearsheet open state changes
     */
    useEffect(() => {
        if (!isInvoiceListOpen) {
            return;
        }
        datagridState.setPageSize(pageLimit);
    }, [pageLimit, isInvoiceListOpen]);

    useEffect(() => {
        if (!isInvoiceListOpen) {
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
        } else {
            datagridState.setSortBy([]);
        }
    }, [
        isInvoiceListOpen,
        searchParams.get("sortByColumn"),
        searchParams.get("sortByOrder"),
    ]);

    return (
        <>
            <div className="invoices-table">
                <Datagrid datagridState={datagridState} />
            </div>
        </>
    );
}

//Transaction date, Invoice id, Currency, Total, Billing period, Provider, Payment Status.

function getColumns(rows, t) {
    return [
        {
            Header: "Transaction Date", //t("username"),
            accessor: "invoiceDate",
            width: getAutoSizedColumnWidth(
                rows,
                "invoiceDate",
                "Transaction date"
            ),
        },
        {
            Header: "Invoice#", //t("fullname"),
            accessor: "invoiceNumber",
            width: getAutoSizedColumnWidth(rows, "invoiceNumber", "Invoice#"),
        },
        {
            Header: "Currency", //t("country"),
            accessor: "currency",
            width: getAutoSizedColumnWidth(rows, "currency", "Currency"),
        },
        {
            Header: "Total", //t("city"),
            accessor: "total",
            width: getAutoSizedColumnWidth(rows, "total", "Total"),
        },
        {
            Header: "Billing Period", //t("postal-code"),
            accessor: "billingPeriod",
            width: getAutoSizedColumnWidth(
                rows,
                "billingPeriod",
                "Billing Period"
            ),
        },
        {
            Header: "Provider", //t("state"),
            accessor: "providerID",
            width: getAutoSizedColumnWidth(rows, "providerID", "Provider"),
        },
        {
            Header: "Payment Status", //t("phone-number"),
            accessor: (row) => {
                return row.paid ? (
                    <StatusIcon
                        iconDescription="Paid"
                        kind="normal"
                        size="md"
                        theme="light"
                    />
                ) : (
                    <StatusIcon
                        iconDescription="Not Paid"
                        kind="minor-warning"
                        size="md"
                        theme="light"
                    />
                );
            },
            width: getAutoSizedColumnWidth(rows, "phoneNumber", "Phonenumber"),
        },
        {
            Header: "",
            accessor: "actions",
            isAction: true,
            sticky: "right",
            disableSortBy: true,
        },
    ];
}
