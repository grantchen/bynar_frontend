import { useTranslation } from "react-i18next";
import {
    useInvoices,
    mergeQueryParams,
    getAutoSizedColumnWidth,
    useSortableColumnsFork,
    SORTABLE_ORDERING,
    omitQueryParams,
    useMobile,
    INVOICESHEET_CONSTANTS,
} from "../../sdk";
import { useSearchParams } from "react-router-dom";
import {
    TableToolbarContent,
    Button,
    Pagination,
    Loading,
    TextInputSkeleton,
    SkeletonText,
} from "@carbon/react";
import {
    DocumentDownload,
    Receipt,
    IbmBluepay,
    Add,
} from "@carbon/react/icons";
import {
    useDatagrid,
    useActionsColumn,
    useStickyColumn,
    useFiltering,
    // useDisableSelectRows,
    // useSelectRows,
    //     useOnRowClick,
    // useCustomizeColumns,
    // useColumnOrder,
    StatusIcon,
    Datagrid,
    pkg,
} from "@carbon/ibm-products";
import { useEffect, useCallback, useMemo, useState } from "react";
import { Restart16, Activity16, TrashCan16 } from "@carbon/icons-react";
import "./invoices-table.scss";
import { ToastNotification } from "carbon-components-react";
import { restrictNumeric } from "payment";
import { format } from "date-fns";

pkg.setAllComponents(true);
pkg.setAllFeatures(true);

export default function InvoicesTable() {
    const {
        invoicesListData,
        isInvoiceListOpen,
        getInvoicesList,
        loading,
        payNow,
        downloadReceipts,
        downloadInvoice,
        notification,
        setLoading
    } = useInvoices();

    const [actionsLoading, setActionsLoading] = useState(false);
    const [tableFilters, setTableFilters] = useState([]);
    const isMobile = useMobile();
    const { t } = useTranslation();

    const [searchParams, setSearchParams] = useSearchParams();

    const columns = useMemo(
        () => getColumns(invoicesListData.invoices, t, loading),
        [invoicesListData.invoices, loading]
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
            transactionStartDate: searchParams.get("transactionStartDate"),
            transactionEndDate: searchParams.get("transactionEndDate"),
            billingStartDate: searchParams.get("billingStartDate"),
            billingEndDate: searchParams.get("billingEndDate"),
            paid: searchParams.get("paid"),
        };
    }, [searchParams]);

    const handleTableFilters = useCallback((filters) => {
        if(tableFilters.length === 0 && filters.length === 0){
            return
        }
        setTableFilters(filters);
    }, [tableFilters]);

    const refresh = useCallback(async () => {
        await getInvoicesList(getInvoicesAPIQuery());
        datagridState.setAllFilters(tableFilters);
    }, [tableFilters, getInvoicesList, getInvoicesAPIQuery]);

    useEffect(() => {
        if (!isInvoiceListOpen) {
            datagridState.setAllFilters([]);
            setTableFilters([]);
            setLoading(true)
            return;
        }
    }, [isInvoiceListOpen]);

    useEffect(() => {
        if (!isInvoiceListOpen) {
            return;
        }
        // datagridState.setAllFilters([])
        const timeoutId = setTimeout(async () => {
            await refresh();
        }, 400);
        return () => clearTimeout(timeoutId);
    }, [refresh, isInvoiceListOpen]);

    useEffect(() => {
        if (!isInvoiceListOpen) {
            return;
        }
        let searchParamsMap = {
            [INVOICESHEET_CONSTANTS.isInvoiceListOpen]: true,
        };
        tableFilters.forEach((filter) => {
            switch (filter.id) {
                case "invoiceDate":
                    searchParamsMap.transactionStartDate =
                        filter.value[0].toISOString();
                    searchParamsMap.transactionEndDate =
                        filter.value[1].toISOString();
                    break;
                case "billingPeriod":
                    searchParamsMap.billingStartDate =
                        filter.value[0].toISOString();
                    searchParamsMap.billingEndDate =
                        filter.value[1].toISOString();
                    break;
                case "paid":
                    searchParamsMap.paid = filter.value;
                    break;
                default:
                    break;
            }
        });
        setSearchParams(searchParamsMap);
    }, [tableFilters, isInvoiceListOpen]);


    const data = useMemo(() => {
        return getFakeOrRealDataBasedOnLoading(invoicesListData.invoices, loading)
    }, [loading, invoicesListData])

    const datagridState = useDatagrid(
        {
            columns,
            data,
            isFetching: false,
            endPlugins: [],
            emptyStateTitle: t("no-invoices"),
            emptyStateDescription: t("no-invoices-action-description"),
            emptyStateSize: "lg",
            filterProps: {
                variation: "flyout", // default
                updateMethod: "batch", // default
                primaryActionLabel: "Apply", // default
                secondaryActionLabel: "Cancel", // default
                flyoutIconDescription: "Open filters", // default
                shouldClickOutsideToClose: false, // default
                filters: getFilters(t),
            },
            rowActions: [
                {
                    id: "pay",
                    itemText: (
                        <div className="row-action-renderer">
                            <IbmBluepay />
                            {t("pay")}
                        </div>
                    ),
                    onClick: async (_, { original }) => {
                        setActionsLoading(true);
                        await payNow(original.id);
                        setActionsLoading(false);
                    },
                    shouldDisableMenuItem: ({ original }) => original.paid,
                },
                {
                    id: "download-invoice",
                    itemText: (
                        <div className="row-action-renderer">
                            <DocumentDownload />
                            {t("invoice")}
                        </div>
                    ),
                    onClick: async (_, { original }) => {
                        setActionsLoading(true);
                        await downloadInvoice(original.id);
                        setActionsLoading(false);
                    },
                    shouldDisableMenuItem: ({ original }) => false,
                },
                {
                    id: "download-receipt",
                    itemText: (
                        <div className="row-action-renderer">
                            <Receipt />
                            {t("receipt")}
                        </div>
                    ),
                    hasDivider: true,
                    shouldDisableMenuItem: ({ original }) => !original.paid,
                    onClick: (_, { original }) => downloadReceipts(original),
                    shouldHideMenuItem: () => true,
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
            DatagridActions: (dgState) => {
                const { FilterFlyout, getFilterFlyoutProps } = dgState;
                const { setAllFilters, ...rest } = getFilterFlyoutProps();
                return (
                    <TableToolbarContent>
                        <FilterFlyout
                            {...rest}
                            setAllFilters={(...args) => {
                                setTimeout(() => {
                                    setAllFilters(...args);
                                }, 1000)
                                handleTableFilters(...args);
                            }}
                        />
                        <Button
                            kind="ghost"
                            hasIconOnly
                            tooltipPosition="bottom"
                            renderIcon={Restart16}
                            iconDescription={t("refresh")}
                            onClick={refresh}
                        />
                    </TableToolbarContent>
                );
            },
        },
        useStickyColumn,
        useActionsColumn,
        useSortableColumnsFork,
        useFiltering
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
            <div className="invoices-table">
                <Datagrid datagridState={datagridState} />
            </div>
            {actionsLoading && <Loading />}
        </>
    );
}


function getFakeOrRealDataBasedOnLoading(data, loading = false){
    if(loading){
        return Array(4).fill(null).map((_, idx) => {
            return {
                billingPeriod: new Date(),
                currency: "EUR",
                id: idx,
                invoiceDate: new Date(),
                invoiceNumber: "Inv-0003",
                paid: false,
                providerID: 1,
                total: 700
            }
        })
    }
    return data
}

function getColumns(rows, t, loading = false) {
    return [
        {
            Header: t("transaction-date"),
            accessor: "invoiceDate",
            width: getAutoSizedColumnWidth(
                rows,
                "invoiceDate",
                "Transaction date",
                "MM/dd/yyyy".length
            ),
            filter: "date",
            Cell: ({ cell: { value } }) =>
                loading ? (
                    <SkeletonText heading={true} className="skeleton-loading" />
                ) : (
                    <>{format(value, "MM/dd/yyyy")}</>
                ),
        },
        {
            Header: t("invoice_number"),
            accessor: "invoiceNumber",
            width: getAutoSizedColumnWidth(rows, "invoiceNumber", "Invoice#"),
            Cell: ({ cell: { value } }) =>
                loading ? (
                    <SkeletonText heading={true} className="skeleton-loading" />
                ) : (
                    <>{value}</>
                ),
        },
        {
            Header: t("currency"),
            accessor: "currency",
            width: getAutoSizedColumnWidth(rows, "currency", "Currency"),
            Cell: ({ cell: { value } }) =>
                loading ? (
                    <SkeletonText heading={true} className="skeleton-loading" />
                ) : (
                    <>{value}</>
                ),
        },
        {
            Header: t("total"),
            accessor: "total",
            width: getAutoSizedColumnWidth(rows, "total", "Total"),
            Cell: ({ cell: { value } }) =>
                loading ? (
                    <SkeletonText heading={true} className="skeleton-loading" />
                ) : (
                    <>{value}</>
                ),
        },
        {
            Header: t("billing-peroid"),
            accessor: "billingPeriod",
            width: getAutoSizedColumnWidth(
                rows,
                "billingPeriod",
                "Billing Period",
                "MM/dd/yyyy".length
            ),
            filter: "date",
            Cell: ({ cell: { value } }) =>
                loading ? (
                    <SkeletonText heading={true} className="skeleton-loading" />
                ) : (
                    <>{format(value, "MM/dd/yyyy")}</>
                ),
        },
        {
            Header: t("provider"),
            accessor: "providerID",
            width: getAutoSizedColumnWidth(rows, "providerID", "Provider"),
            Cell: ({ cell: { value } }) =>
                loading ? (
                    <SkeletonText heading={true} className="skeleton-loading" />
                ) : (
                    <>{value}</>
                ),
        },
        {
            Header: t("payment-status"),
            accessor: "paid",
            width: getAutoSizedColumnWidth(rows, "paid", "Payment Status"),
            filter: "radio",
            Cell: ({ cell: { value } }) =>
                loading ? (
                    <SkeletonText heading={true} className="skeleton-loading" />
                ) : value ? (
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
                ),
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

function getFilters(t) {
    return [
        {
            type: "date",
            column: "invoiceDate",
            props: {
                DatePicker: {
                    datePickerType: "range",
                    // Add any other Carbon DatePicker props here
                },
                DatePickerInput: {
                    start: {
                        id: "date-picker-invoiceDate-start",
                        placeholder: "mm/dd/yyyy",
                        labelText: "Invoice Date Start",
                        // Add any other Carbon DatePickerInput props here
                    },
                    end: {
                        id: "date-picker-invoiceDate-end",
                        placeholder: "mm/dd/yyyy",
                        labelText: "Invoice Date End",
                        // Add any other Carbon DatePickerInput props here
                    },
                },
            },
        },
        {
            type: "date",
            column: "billingPeriod",
            props: {
                DatePicker: {
                    datePickerType: "range",
                    // Add any other Carbon DatePicker props here
                },
                DatePickerInput: {
                    start: {
                        id: "date-picker-billingPeriod-start",
                        placeholder: "mm/dd/yyyy",
                        labelText: "Billing Period Start",
                        // Add any other Carbon DatePickerInput props here
                    },
                    end: {
                        id: "date-picker-billingPeriod-end",
                        placeholder: "mm/dd/yyyy",
                        labelText: "Billing Period End",
                        // Add any other Carbon DatePickerInput props here
                    },
                },
            },
        },
        {
            type: "radio",
            column: "paid",
            props: {
                FormGroup: {
                    legendText: "Payment Status",
                    // Add any other Carbon FormGroup props here
                },
                RadioButtonGroup: {
                    orientation: "vertical",
                    legend: "Payment Status legend",
                    name: "payment-status-radio-button-group",
                    // Add any other Carbon RadioButtonGroup props here
                },
                RadioButton: [
                    {
                        id: "paid",
                        labelText: "Paid",
                        value: "true",
                        // Add any other Carbon RadioButton props here
                    },
                    {
                        id: "unpaid",
                        labelText: "Unpaid",
                        value: "false",
                        // Add any other Carbon RadioButton props here
                    },
                ],
            },
        },
    ];
}

/**
 * 
 * 
 * 
        {
            type: "dropdown",
            column: "paid",
            props: {
                Dropdown: {
                    id: "payment-status-dropdown",
                    ariaLabel: "Payment status dropdown",
                    items: ["paid", "not paid"],
                    label: "Payment status",
                    titleText: "Payment status",
                    // Add any other Carbon Dropdown props here
                },
            },
        },
        {
            type: "date",
            column: "joined",
            props: {
                DatePicker: {
                    datePickerType: "range",
                    // Add any other Carbon DatePicker props here
                },
                DatePickerInput: {
                    start: {
                        id: "date-picker-input-id-start",
                        placeholder: "mm/dd/yyyy",
                        labelText: "Joined start date",
                        // Add any other Carbon DatePickerInput props here
                    },
                    end: {
                        id: "date-picker-input-id-end",
                        placeholder: "mm/dd/yyyy",
                        labelText: "Joined end date",
                        // Add any other Carbon DatePickerInput props here
                    },
                },
            },
        },
        {
            type: "number",
            column: "visits",
            props: {
                NumberInput: {
                    min: 0,
                    id: "visits-number-input",
                    invalidText: "A valid value is required",
                    label: "Visits",
                    placeholder: "Type a number amount of visits",
                    // Add any other Carbon NumberInput props here
                },
            },
        },
        {
            type: "checkbox",
            column: "passwordStrength",
            props: {
                FormGroup: {
                    legendText: "Password strength",
                    // Add any other Carbon FormGroup props here
                },
                Checkbox: [
                    {
                        id: "normal",
                        labelText: "Normal",
                        value: "normal",
                        // Add any other Carbon Checkbox props here
                    },
                    {
                        id: "minor-warning",
                        labelText: "Minor warning",
                        value: "minor-warning",
                        // Add any other Carbon Checkbox props here
                    },
                    {
                        id: "critical",
                        labelText: "Critical",
                        value: "critical",
                        // Add any other Carbon Checkbox props here
                    },
                ],
            },
        },
        {
            type: "radio",
            column: "role",
            props: {
                FormGroup: {
                    legendText: "Role",
                    // Add any other Carbon FormGroup props here
                },
                RadioButtonGroup: {
                    orientation: "vertical",
                    legend: "Role legend",
                    name: "role-radio-button-group",
                    // Add any other Carbon RadioButtonGroup props here
                },
                RadioButton: [
                    {
                        id: "developer",
                        labelText: "Developer",
                        value: "developer",
                        // Add any other Carbon RadioButton props here
                    },
                    {
                        id: "designer",
                        labelText: "Designer",
                        value: "designer",
                        // Add any other Carbon RadioButton props here
                    },
                    {
                        id: "researcher",
                        labelText: "Researcher",
                        value: "researcher",
                        // Add any other Carbon RadioButton props here
                    },
                ],
            },
        },
 */
