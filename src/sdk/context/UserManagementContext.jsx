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
const UserManagementContext = createContext();

// UserManagementProvider is a wrapper component that provides the UserManagementContext
const UserManagementProvider = ({ children }) => {
    const { authFetch, hasPermission } = useAuth();
    const { t } = useTranslation();
    /**render aware states */
    const [userListData, setUserListData] = useState({
        userAccountDetails: [],
        totalCount: 0,
    });
    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState(null);
    const [searchParams, setSearchParams] = useSearchParams();

    /**render unaware states */
    const [userListParams, setUserListParams] = useState({});
    const [deleteModalProps, setDeleteModalProps] = useState(null);

    const editUserPanelOpen = Boolean(searchParams.get("userIdToBeEdited"));
    const addUserPanelOpen = Boolean(searchParams.get("openAddUserPanel"));
    const userDetailsOpen = Boolean(searchParams.get("userIdToShowDetails"));

    const isUserManagementAllowed = useMemo(
        () => hasPermission && hasPermission("user_list", "list"),
        [hasPermission]
    );

    const getUserList = useCallback(
        async (queryParams = {}) => {
            setLoading(true);
            setUserListData((prev) => ({
                ...prev,
                userAccountDetails: [],
            }));
            try {
                const searchQueryParams = new URLSearchParams(
                    removeNullEntries(queryParams)
                ).toString();

                const response = await authFetch(
                    `${BaseURL}/list-users?${searchQueryParams}`
                );
                if (response.ok) {
                    const res = await response.json();
                    const result = {
                        ...res?.result,
                        userAccountDetails: res?.result?.userAccountDetails.map(
                            (value, index) => ({
                                ...value,
                                disabled: !value?.canDelete,
                                isEditable: value?.canUpdate,
                            })
                        ),
                    };
                    setUserListData(result);
                }
            } catch (error) {
                setNotification({
                    type: "error",
                    message: t("user-load-failed"),
                });
            } finally {
                setLoading(false);
            }
        },
        [authFetch, t]
    );

    const deleteUser = useCallback(
        async (ids) => {
            setLoading(true);
            try {
                const response = await authFetch(`${BaseURL}/user`, {
                    method: "DELETE",
                    body: JSON.stringify({ accountIDs: [...ids] }),
                });
                if (response.ok) {
                    setNotification({
                        message: t("user-deleted-successfully"),
                        type: "success",
                    });
                    await getUserList();
                } else if (response.status === 500) {
                    setNotification({
                        message: t("error-deleting-user"),
                        type: "error",
                    });
                }
            } catch (error) {
                setNotification({
                    type: "error",
                    message: t("error-deleting-user"),
                });
            } finally {
                setLoading(false);
            }
        },
        [getUserList, authFetch]
    );

    const updateUser = useCallback(
        async ({ userDetails }) => {
            const response = await authFetch(`${BaseURL}/user`, {
                method: "PUT",
                body: JSON.stringify(userDetails),
            });

            const res = await response.json();

            if (response.ok) {
                closeModalAndGoBackToUserList();
            } else if (response.status === 500) {
                throw { message: res.error, type: "error" };
            } else {
                throw { message: t("error-updating-user"), type: "error" };
            }
        },
        [authFetch]
    );
    const addUser = useCallback(
        async ({ userDetails }) => {
            const response = await authFetch(`${BaseURL}/user`, {
                method: "POST",
                body: JSON.stringify(userDetails),
            });

            const res = await response.json();

            if (response.ok) {
                closeModalAndGoBackToUserList();
            } else if (response.status === 500) {
                throw { message: res.error, type: "error" };
            } else {
                throw { message: t("error-adding-user"), type: "error" };
            }
        },
        [authFetch]
    );

    const getUserById = useCallback(
        async (id) => {
            const response = await authFetch(`${BaseURL}/user/${id}`).then(
                (res) => {
                   return res.json()
                }
            );
            return response;
        },
        [authFetch]
    );

    const openDeleteModal = useCallback(
        ({ userIdToBeDeleted, userNameToBeDeleted }) => {
            if (!userIdToBeDeleted || !userNameToBeDeleted) {
                return;
            }
            setUserListParams(mergeQueryParams(searchParams, {}));
            setSearchParams({ userIdToBeDeleted, userNameToBeDeleted });
            setDeleteModalProps({
                body: `${t(
                    "delete-modal-heading-1"
                )} ${userNameToBeDeleted} ${t("delete-modal-heading-2")}`,
                className: "remove-modal-test",
                title: t("delete-modal-title"),
                iconDescription: t("delete-modal-icon"),
                inputInvalidText: t("delete-modal-invalid-input-text"),
                inputLabelText: `${t(
                    "delete-modal-input-label-text-1"
                )} "${userNameToBeDeleted}" ${t("delete-modal-input-label-text-2")}`,
                inputPlaceholderText: `${userNameToBeDeleted}`,
                open: true,
                onClose: () => {
                    setDeleteModalProps(null);
                    setUserListParams((prev) => {
                        setSearchParams(prev);
                        return {};
                    });
                },
                primaryButtonText: t("delete"),
                primaryButtonDisabled: false,
                resourceName: `${userNameToBeDeleted}`,
                secondaryButtonText: t("close"),
                label: `${t("delete")} ${userNameToBeDeleted}`,
                textConfirmation: true,
                onRequestSubmit: async () => {
                    try {
                        setLoading(true);
                        const response = await authFetch(`${BaseURL}/user`, {
                            method: "DELETE",
                            body: JSON.stringify({
                                accountIDs: [parseInt(userIdToBeDeleted)],
                            }),
                        });
                        if (response.ok) {
                            setNotification({
                                type: "success",
                                message: t("user-deleted-successfully"),
                            });
                        } else {
                            throw "error";
                        }
                    } catch (error) {
                        setNotification({
                            type: "error",
                            message: t("error-deleting-user"),
                        });
                    } finally {
                        setLoading(false);
                        setDeleteModalProps(null);
                        setUserListParams((prev) => {
                            setSearchParams(prev);
                            return {};
                        });
                    }
                },
            });
        },
        [searchParams, authFetch]
    );

    const openBulkDeleteConfirmModal = useCallback(
        ({ userIdsToBeDeleted = [] }) => {
            if (!userIdsToBeDeleted) {
                return;
            }
            setUserListParams(mergeQueryParams(searchParams, {}));
            setSearchParams({ userIdsToBeDeleted });
            setDeleteModalProps({
                body: t("delete-modal-bulk-heading"),
                className: "remove-modal-test",
                title: t("delete-modal-title"),
                iconDescription: t("delete-modal-icon"),
                inputInvalidText: t("delete-modal-invalid-input-text"),
                inputLabelText: `${t(
                    "delete-modal-input-label-text-1"
                )} "delete all" ${t("delete-modal-input-label-text-2")}`,
                inputPlaceholderText: "delete all",
                open: true,
                onClose: () => {
                    setDeleteModalProps(null);
                    setUserListParams((prev) => {
                        setSearchParams(prev);
                        return {};
                    });
                },
                primaryButtonText: t("delete"),
                primaryButtonDisabled: false,
                resourceName: "delete all",
                secondaryButtonText: t("close"),
                label: t("delete-users"),
                textConfirmation: true,
                onRequestSubmit: async () => {
                    try {
                        setLoading(true);
                        const response = await authFetch(`${BaseURL}/user`, {
                            method: "DELETE",
                            body: JSON.stringify({
                                accountIDs: userIdsToBeDeleted,
                            }),
                        });
                        if (response.ok) {
                            setNotification({
                                type: "success",
                                message: t("user-deleted-successfully"),
                            });
                        } else {
                            throw "error";
                        }
                    } catch (error) {
                        setNotification({
                            type: "error",
                            message: t("error-deleting-user"),
                        });
                    } finally {
                        setLoading(false);
                        setDeleteModalProps(null);
                        setUserListParams((prev) => {
                            setSearchParams(prev);
                            return {};
                        });
                    }
                },
            });
        },
        [searchParams, authFetch]
    );

    const openEditPanel = useCallback(
        ({ userIdToBeEdited }) => {
            if (!userIdToBeEdited) {
                return;
            }
            setUserListParams(mergeQueryParams(searchParams, {}));
            setSearchParams({ userIdToBeEdited });
        },
        [searchParams]
    );

    const openAddUserModel = useCallback(() => {
        setUserListParams(mergeQueryParams(searchParams, {}));
        setSearchParams({ openAddUserPanel: true });
    }, [searchParams]);

    const openUserDetails = useCallback(
        ({ userIdToShowDetails }) => {
            if (!userIdToShowDetails) {
                return;
            }
            setUserListParams(mergeQueryParams(searchParams, {}));
            setSearchParams({ userIdToShowDetails });
        },
        [searchParams]
    );

    const closeModalAndGoBackToUserList = useCallback(() => {
        setUserListParams((prev) => {
            setSearchParams(prev)
            return {}
        });
    }, [searchParams]);
    useEffect(() => {
        if (!searchParams.get("isUserListOpen")) {
            setNotification(null);
        }
    }, [searchParams.get("isUserListOpen")]);


    const value = useMemo(
        () => ({
            userListData,
            notification,
            loading,
            isUserManagementAllowed,
            getUserList,
            deleteUser,
            openDeleteModal,
            openEditPanel,
            closeModalAndGoBackToUserList,
            updateUser,
            openAddUserModel,
            addUser,
            openUserDetails,
            getUserById,
            openBulkDeleteConfirmModal,
        }),
        [
            userListData,
            getUserList,
            deleteUser,
            loading,
            isUserManagementAllowed,
            openDeleteModal,
            notification,
            openEditPanel,
            closeModalAndGoBackToUserList,
            updateUser,
            openAddUserModel,
            addUser,
            openUserDetails,
            getUserById,
            openBulkDeleteConfirmModal,
        ]
    );
    return (
        <>
            <UserManagementContext.Provider value={value}>
                {children}
                {isUserManagementAllowed && (
                    <SidePanels open={editUserPanelOpen} />
                )}
                {isUserManagementAllowed && (
                    <SidePanels open={addUserPanelOpen} />
                )}
                {(
                    <UserDetailPanel open={userDetailsOpen} />
                )}
            </UserManagementContext.Provider>
            {deleteModalProps && <RemoveModalWithLoading deleteModalProps={deleteModalProps} loading={loading} />}

        </>
    );
};

export { UserManagementContext, UserManagementProvider };

export const useUserManagement = () => useContext(UserManagementContext);
