import React, {
    createContext,
    useState,
    useContext,
    useMemo,
    useCallback,
    useEffect,
} from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {useAuth} from "../AuthContext";
import {useTranslation} from "react-i18next";
import OrganizationAccountPanel from "../../components/OrganizationAccountPanel";
import {BaseURL} from "../constant";
import {RemoveModalWithLoading} from "../RemoveModalWithLoading";

const OrganizationAccountContext = createContext();

const CONSTANTS = {
    openOrganizationAccountPanel: "openOrganizationAccountPanel",
};

const OrganizationAccountProvider = ({children}) => {
    const {tokenClaims, authFetch} = useAuth();
    const {t} = useTranslation();
    const { signout } = useAuth();
    const navigate = useNavigate();

    /**render aware states */
    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const [deleteModalProps, setDeleteModalProps] = useState(null);

    const {isSidePanelOpen, setIsSidePanelOpen} = useMemo(() => {
        return {
            isSidePanelOpen:
                searchParams.get(
                    CONSTANTS.openOrganizationAccountPanel
                ) === "true",
            setIsSidePanelOpen: (isOpen) =>
                setSearchParams({
                    [CONSTANTS.openOrganizationAccountPanel]: isOpen,
                }),
        };
    }, [searchParams.get(CONSTANTS.openOrganizationAccountPanel)]);


    const isOrganizationAccountAllowed = useMemo(
        () => tokenClaims?.organization_account === true,
        [tokenClaims?.organization_account],
    );

    const closeOrganizationAccountPanel = useCallback(() => {
        setIsSidePanelOpen(false);
        setSearchParams({})
    }, []);

    const openOrganizationAccountPanel = useCallback(() => {
        setIsSidePanelOpen(true);
    }, []);


    const openDeleteModal = useCallback(
        ({confirmText}) => {
            if (!confirmText) {
                return;
            }
            setSearchParams({
                confirmDeleteAccount: confirmText
            });
            setDeleteModalProps({
                body: `${t("delete-modal-heading-1")} 
                ${t("delete-organization-account-modal-heading-2")}`,
                title: t("delete-modal-title"),
                iconDescription: t("delete-modal-icon"),
                inputInvalidText: t("delete-modal-invalid-input-text"),
                inputLabelText: `${t(
                    "delete-modal-input-label-text-1"
                )} "${confirmText}" ${t("delete-modal-input-label-text-2")}`,
                inputPlaceholderText: `${confirmText}`,
                open: true,
                onClose: () => {
                    setDeleteModalProps(null);
                    navigate(-1);
                },
                primaryButtonText: t("delete"),
                primaryButtonDisabled: false,
                resourceName: `${confirmText}`,
                secondaryButtonText: t("close"),
                label: t("delete-account"),
                textConfirmation: true,
                onRequestSubmit: async () => {
                    try {
                        setLoading(true);
                        const response = await authFetch(`${BaseURL}/delete-organization-account`, {
                            method: "DELETE",
                        });
                        const res = await response.json()
                        if (response.ok) {
                            signout();
                        } else if (response.status === 500) {
                            setNotification({
                                type: "error",
                                message: res.error,
                            });
                        } else {
                            throw "error";
                        }
                    } catch (error) {
                        console.log(error)
                        setNotification({
                            type: "error",
                            message: t("error-deleting-account"),
                        });
                    } finally {
                        setLoading(false);
                        setDeleteModalProps(null);
                        navigate(-1);
                    }
                },
            });
        },
        [authFetch]
    );


    useEffect(() => {
        if (
            !searchParams.get(CONSTANTS.openOrganizationAccountPanel)
        ) {
            setNotification(null);
        }
    }, [searchParams.get(CONSTANTS.openOrganizationAccountPanel)]);

    const value = useMemo(
        () => ({
            notification,
            loading,
            isOrganizationAccountAllowed,
            setNotification,
            closeOrganizationAccountPanel,
            openOrganizationAccountPanel,
            openDeleteModal,
        }),
        [
            notification,
            loading,
            isOrganizationAccountAllowed,
            setNotification,
            closeOrganizationAccountPanel,
            openOrganizationAccountPanel,
            openDeleteModal,
        ]
    );
    return (
        <>
            <OrganizationAccountContext.Provider value={value}>
                {children}

                {isOrganizationAccountAllowed && (
                    <OrganizationAccountPanel open={isSidePanelOpen}/>
                )}
            </OrganizationAccountContext.Provider>
            {deleteModalProps && <RemoveModalWithLoading deleteModalProps={deleteModalProps} loading={loading}/>}
        </>
    );
};

export {OrganizationAccountContext, OrganizationAccountProvider};

export const useOrganizationAccount = () => useContext(OrganizationAccountContext);
