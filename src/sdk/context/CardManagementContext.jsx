import React, {
    createContext,
    useState,
    useContext,
    useMemo,
    useCallback,
    useEffect,
} from "react";
import { BaseURL } from "../constant";
import { useNavigate, useSearchParams } from "react-router-dom";
import { mergeQueryParams, removeNullEntries } from "../util";
import { SidePanels } from "../../components/SidePanel";
import { UserDetailPanel } from "../../components/UserDetailPanel";
import { useAuth } from "../AuthContext";
import { useTranslation } from "react-i18next";
import { RemoveModalWithLoading } from "../RemoveModalWithLoading";
import { Tearsheet } from "@carbon/ibm-products";
import InvoicesTable from "../../components/InvoicesTable";
import { format } from "date-fns";
import UserCardManagementPanel from "../../components/UserCardManagementPanel";
import AddCardModal from "../AddCardModal";

const CardManagementContext = createContext();

const CARD_MANAGEMENT_CONSTANTS = {
    openCardManagementPanel: "openCardMangementPanel",
    openAddCardModal: "openCardAddModal",
};
const CardManagementProvider = ({ children }) => {
    const { user, authFetch } = useAuth();
    const { t } = useTranslation();
    /**render aware states */
    const [cardsData, setCardsData] = useState({});
    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    const [deleteModalProps, setDeleteModalProps] = useState(null);

    const { isSidePanelOpen, setIsSidePanelOpen } = useMemo(() => {
        return {
            isSidePanelOpen:
                searchParams.get(
                    CARD_MANAGEMENT_CONSTANTS.openCardManagementPanel
                ) === "true",
            setIsSidePanelOpen: (isOpen) =>
                setSearchParams({
                    [CARD_MANAGEMENT_CONSTANTS.openCardManagementPanel]: isOpen,
                }),
        };
    }, [searchParams.get(CARD_MANAGEMENT_CONSTANTS.openCardManagementPanel)]);

    const { isCardAddModelOpen, setIsCardAddModalOpen } = useMemo(() => {
        return {
            isCardAddModelOpen:
                searchParams.get(CARD_MANAGEMENT_CONSTANTS.openAddCardModal) ===
                "true",
            setIsCardAddModalOpen: (isOpen) =>
                setSearchParams({
                    [CARD_MANAGEMENT_CONSTANTS.openAddCardModal]: isOpen,
                }),
        };
    }, [searchParams.get(
        CARD_MANAGEMENT_CONSTANTS.openAddCardModal
    )]);

    const isCardManagementAllowed = useMemo(
        () => user,
        [user]
    );

    const closeCardManagementPanel = useCallback(() => {
        setIsSidePanelOpen(false);
    }, []);

    const openCardManagementPanel = useCallback(() => {
        setIsSidePanelOpen(true);
    }, []);

    const openCardAddModal = useCallback(() => {
        setIsCardAddModalOpen(true)
    }, [searchParams]);

    const getUserCardList = useCallback(
        async (queryParams = {}) => {
            setLoading(true);
            try {
                const searchQueryParams = new URLSearchParams(
                    removeNullEntries(queryParams)
                ).toString();

                const response = await authFetch(
                    `${BaseURL}/apprunnerurl/cards/list?${searchQueryParams}`,
                );
                const res = await response.json();
                if (response.ok) {
                    setCardsData(res);
                } else if (response.status === 500) {
                    setNotification({
                        type: "error",
                        message: res.error,
                    });
                }
            } catch (error) {
                setNotification({
                    type: "error",
                    message: t("payment-failed"),
                });
            } finally {
                setLoading(false);
            }
        },
        [authFetch, t]
    );
    const makeDefaultMethod = useCallback(
        async (cardId) => {
            try {
                setNotification(null)
                setLoading(true);
                const res = await authFetch(`${BaseURL}/apprunnerurl/cards/update`, {
                    method: "POST",
                    body: JSON.stringify({ source_id: cardId }),
                });
                if (res.ok) {
                    setNotification({
                        type: "success",
                        message: t("payment-successful"),
                    });
                }
                await getUserCardList();
            } catch (error) {
                setNotification({
                    type: "error",
                    message: t("payment-failed"),
                });
                //todo show notification
            } finally {
                setLoading(false);
            }
        },
        [authFetch]
    );

    const handleVerifyCard = useCallback(
        async (token) => {
            setNotification(null)
            console.log("token", token);
            const data = {
                token: token,
            };
            const response = await authFetch(`${BaseURL}/apprunnerurl/cards/add`, {
                method: "POST",
                body: JSON.stringify(data),
            });

            const res = await response.json();

            if (response.ok) {
                setNotification({
                    type: "success",
                    message: t("card-added-successfully"),
                });
                navigate(-1);
            } else if (response.status === 500) {
                setNotification({
                    type: "error",
                    message: res.error,
                });
            } else {
                throw { message: t("error-adding-user-card"), type: "error" };
            }
        },
        [authFetch]
    );

    const openUserCardDeleteModal = useCallback(
        ({ cardIdToBeDeleted, last4Digit }) => {
            if (!cardIdToBeDeleted || !last4Digit) {
                return;
            }
            setSearchParams({ cardIdToBeDeleted });
            setDeleteModalProps({
                body: `${t("delete-modal-heading-1")} ${t(
                    "delete-card-modal-heading-2"
                )}`,
                title: t("delete-modal-title"),
                iconDescription: t("delete-modal-icon"),
                inputInvalidText: t("delete-modal-invalid-input-text"),
                inputLabelText: t("type-last-four-digit"),
                inputPlaceholderText: last4Digit,
                open: true,
                onClose: () => {
                    setDeleteModalProps(null);
                    navigate(-1);
                },
                primaryButtonText: t("delete"),
                primaryButtonDisabled: false,
                resourceName: last4Digit,
                secondaryButtonText: t("close"),
                label: `${t("delete")} ${t("card")}`,
                textConfirmation: true,
                onRequestSubmit: async () => {
                    try {
                        setNotification(null)
                        setLoading(true);
                        const response = await authFetch(
                            `${BaseURL}/apprunnerurl/cards/delete`,
                            {
                                method: "POST",
                                body: JSON.stringify({ source_id: cardIdToBeDeleted }),
                            }
                        );
                        const res = await response.json()
                        if (response.ok) {
                            setNotification({
                                type: "success",
                                message: t("card-deleted-successfully"),
                            });
                        } else if (response.status === 500) {
                            setNotification({
                                type: "error",
                                message: res.error,
                            });
                        } else {
                            throw "error";
                        }
                    } catch (error) {
                        setNotification({
                            type: "error",
                            message: t("error-deleting-card"),
                        });
                    } finally {
                        setLoading(false);
                        setDeleteModalProps(null);
                        navigate(-1);
                    }
                },
            });
        },
        [searchParams, authFetch]
    );
    useEffect(() => {
        if (
            !searchParams.get(CARD_MANAGEMENT_CONSTANTS.openCardManagementPanel)
        ) {
            setNotification(null);
        }
    }, [searchParams.get(CARD_MANAGEMENT_CONSTANTS.openCardManagementPanel)]);

    const value = useMemo(
        () => ({
            cardsData,
            notification,
            loading,
            isCardManagementAllowed,
            setNotification,
            getUserCardList,
            closeCardManagementPanel,
            openCardManagementPanel,
            makeDefaultMethod,
            handleVerifyCard,
            openUserCardDeleteModal,
            openCardAddModal,
        }),
        [
            cardsData,
            notification,
            loading,
            isCardManagementAllowed,
            setNotification,
            getUserCardList,
            closeCardManagementPanel,
            openCardManagementPanel,
            makeDefaultMethod,
            handleVerifyCard,
            openUserCardDeleteModal,
            openCardAddModal,
        ]
    );
    return (
        <>
            <CardManagementContext.Provider value={value}>
                {children}

                {isCardManagementAllowed && (
                    <UserCardManagementPanel open={isSidePanelOpen} />
                )}
                {isCardManagementAllowed && (
                    <AddCardModal open={isCardAddModelOpen} />
                )}
            </CardManagementContext.Provider>
            {deleteModalProps && <RemoveModalWithLoading deleteModalProps={deleteModalProps} loading={loading} />}
        </>
    );
};

export { CardManagementContext, CardManagementProvider };

export const useCardManagement = () => useContext(CardManagementContext);
