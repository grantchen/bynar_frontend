import React, {
    createContext,
    useState,
    useContext,
    useMemo,
    useCallback,
    useEffect,
} from "react";
import { BaseURL } from "../constant";
import { useSearchParams } from "react-router-dom";
import { mergeQueryParams, removeNullEntries } from "../util";
import { SidePanels } from "../../components/SidePanel";
import { UserDetailPanel } from "../../components/UserDetailPanel";
import { useAuth } from "../AuthContext";
import { useTranslation } from "react-i18next";
import { RemoveModalWithLoading } from "../RemoveModalWithLoading";
import { Tearsheet } from "@carbon/ibm-products";
import InvoicesTable from "../../components/InvoicesTable";
import { format } from "date-fns";

const InvoicesContext = createContext();

const INVOICESHEET_CONSTANTS = {
    isInvoiceListOpen: "isInvoiceListOpen",
};
const InvoicesProvider = ({ children }) => {
    const { user, authFetch } = useAuth();
    const { t } = useTranslation();
    /**render aware states */
    const [invoicesListData, setInvoicesListData] = useState({
        invoices: [],
        totalCount: 0,
    });
    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState(null);
    const [searchParams, setSearchParams] = useSearchParams();

    const { isInvoiceListOpen, setIsInvoiceListOpen } = useMemo(() => {
        return {
            isInvoiceListOpen:
                searchParams.get(INVOICESHEET_CONSTANTS.isInvoiceListOpen) ===
                "true",
            setIsInvoiceListOpen: (isOpen) =>
                setSearchParams({
                    [INVOICESHEET_CONSTANTS.isInvoiceListOpen]: isOpen,
                }),
        };
    }, [searchParams.get(INVOICESHEET_CONSTANTS.isInvoiceListOpen)]);

    const isUserManagementAllowed = useMemo(
        () =>
            user &&
            !(
                user?.cognitoUserGroups === "Users" ||
                user?.cognitoUserGroups?.length === 0
            ),
        [user]
    );

    const handleCloseInvoiceList = useCallback(() => {
        setIsInvoiceListOpen(false);
    }, []);

    const handleOpenInvoiceList = useCallback(() => {
        setIsInvoiceListOpen(true);
    }, []);

    const getInvoicesList = useCallback(
        async (queryParams = {}) => {
            setLoading(true);
            setInvoicesListData((prev) => ({
                ...prev,
                invoices: [],
            }));
            try {
                const searchQueryParams = new URLSearchParams(
                    removeNullEntries(queryParams)
                ).toString();

                const response = await authFetch(
                    `${BaseURL}/list-invoices?${searchQueryParams}`
                );
                if (response.ok) {
                    const res = await response.json();
                    const result = {
                        ...res?.result,
                        invoices: res?.result?.invoice.map((value) => ({
                            ...value,
                            invoiceDate: format(
                                new Date(value.invoiceDate),
                                "MM/dd/yyyy"
                            ),
                            billingPeriod: format(
                                new Date(value.billingPeriod),
                                "MM/dd/yyyy"
                            ),
                            // disabled: !value?.canDelete,
                            // isEditable: value?.canUpdate,
                        })),
                    };
                    setInvoicesListData(result);
                }
            } catch (error) {
                setNotification({
                    type: "error",
                    message: t("invoices-load-failed"),
                });
            } finally {
                setLoading(false);
            }
        },
        [authFetch, t]
    );
    const payNow = useCallback(
        async (id) => {
            try {
                const response = await authFetch(
                    `${BaseURL}/invoice/${id}/pay`,
                    {
                        method: 'POST'
                    }
                );
                if (response.ok) {
                    setNotification({
                        message: t("payment-successful"),
                        type: "success",
                    });
                    return;
                }
                throw "";
            } catch (error) {
                setNotification({
                    message: t("payment-failed"),
                    type: "error",
                });
            }
        },
        [authFetch]
    );

    const downloadReceipts = useCallback(
        async (id) => {
            alert("api not ready");
        },
        [authFetch]
    );
    const downloadInvoice = useCallback(
        async (id) => {
            const { url } = await authFetch(
                `${BaseURL}/invoice/${id}/download`
            ).then((res) => res.json());

            window.open(url);
        },
        [authFetch]
    );

    useEffect(() => {
        if (!searchParams.get(INVOICESHEET_CONSTANTS.isInvoiceListOpen)) {
            setNotification(null);
        }
    }, [searchParams.get(INVOICESHEET_CONSTANTS.isInvoiceListOpen)]);

    const value = useMemo(
        () => ({
            invoicesListData,
            notification,
            loading,
            isUserManagementAllowed,
            getInvoicesList,
            handleOpenInvoiceList,
            downloadInvoice,
            isInvoiceListOpen,
            payNow,
            downloadReceipts,
        }),
        [
            invoicesListData,
            notification,
            loading,
            isUserManagementAllowed,
            getInvoicesList,
            handleOpenInvoiceList,
            downloadInvoice,
            isInvoiceListOpen,
            payNow,
            downloadReceipts,
        ]
    );
    return (
        <>
            <InvoicesContext.Provider value={value}>
                {children}
                <Tearsheet
                    hasCloseIcon
                    closeIconDescription={t("close-tearsheet-text")}
                    label=""
                    onClose={handleCloseInvoiceList}
                    open={isInvoiceListOpen}
                    preventCloseOnClickOutside
                    // title={t("user-list")} // todo
                    title={t("invoices")}
                >
                    <InvoicesTable />
                </Tearsheet>
            </InvoicesContext.Provider>
        </>
    );
};

export { InvoicesContext, InvoicesProvider };

export const useInvoices = () => useContext(InvoicesContext);
