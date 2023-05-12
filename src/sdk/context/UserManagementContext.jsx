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
import { RemoveModal } from "@carbon/ibm-products";
import { SidePanels } from "../../components/SidePanel";
import { UserDetailPanel } from "../../components/UserDetailPanel";
import { useAuth } from "../AuthContext";
import { useTranslation } from "react-i18next";

const UserManagementContext = createContext();

const UserManagementProvider = ({ children }) => {
    const { user, authFetch } = useAuth();
    const {t} = useTranslation();
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

    const editUserPanelOpen = searchParams.get("userIdToBeEdited");
    const addUserPanelOpen = searchParams.get("openAddUserPanel");
    const userDetailsOpen = searchParams.get("userIdToShowDetails");

    const isUserManagementAllowed = useMemo(
        () =>
        user && !(user?.cognitoUserGroups === "Users" ||
            user?.cognitoUserGroups?.length === 0),
        [user]
    );
    

    const getUserList = useCallback(async (queryParams = {}) => {
        setLoading(true);
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
                message: "Failed to load users data",
            });
        } finally {
            setLoading(false);
        }
    }, [authFetch]);

    const deleteUser = useCallback(
        async (ids) => {
            setLoading(true);
            try {
                const response = await authFetch(`${BaseURL}/user`, {
                    method: "DELETE",
                    body: JSON.stringify({ accountIDs: [...ids] })
                });
                if (response.ok) {
                    setNotification({
                        message: "User deleted sucessfully",
                        type: "success",
                    });
                    await getUserList();
                } else if (response.status === 500) {
                    setNotification({
                        message: "Error deleting user",
                        type: "error",
                    });
                }
            } catch (error) {
                setNotification({
                    type: "error",
                    message: "Error deleting user",
                });
            } finally {
                setLoading(false);
            }
        },
        [getUserList, authFetch]
    );

    const updateUser = useCallback(async ({ userDetails }) => {
        const response = await authFetch(`${BaseURL}/user`, {
            method: "PUT",
            body: JSON.stringify(userDetails)
        });

        const res = await response.json();

        if (response.ok) {
            closeModalAndGoBackToUserList();
        } else if (response.status === 500) {
            throw { message: res.error, type: "error" };
        } else {
            throw { message: "Error updating user", type: "error" };
        }
    }, [authFetch]);
    const addUser = useCallback(async ({ userDetails }) => {
        const response = await authFetch(`${BaseURL}/user`, {
            method: "POST",
            body: JSON.stringify(userDetails)
        });

        const res = await response.json();

        if (response.ok) {
            closeModalAndGoBackToUserList();
        } else if (response.status === 500) {
            throw { message: res.error, type: "error" };
        } else {
            throw { message: "Error updating user", type: "error" };
        }
    }, [authFetch]);

    const getUserById = useCallback(async (id) => {
        const response = await authFetch(`${BaseURL}/user/${id}`).then((res) => res.json());
        return response;
    }, [authFetch]);

    const openDeleteModal = useCallback(
        ({ userIdToBeDeleted, userNameToBeDeleted }) => {
            if (!userIdToBeDeleted || !userNameToBeDeleted) {
                return;
            }
            setUserListParams(mergeQueryParams(searchParams, {}));
            setSearchParams({ userIdToBeDeleted, userNameToBeDeleted });
            setDeleteModalProps({
                body: `${t('delete-modal-heading-1')} ${userNameToBeDeleted} ${t('delete-modal-heading-2')}`,
                className: "remove-modal-test",
                title: t('delete-modal-title'),
                iconDescription: t('delete-modal-icon'),
                inputInvalidText: t('delete-modal-invalid-input-text'),
                inputLabelText: `${t('delete-modal-input-label-text-1')} "delete" ${t('delete-modal-input-label-text-2')}`,
                inputPlaceholderText: "delete",
                open: true,
                onClose: () => {
                    setDeleteModalProps(null);
                    setUserListParams((prev) => {
                        setSearchParams(prev);
                        return {};
                    });
                },
                primaryButtonText: t('delete'),
                resourceName: "delete",
                secondaryButtonText: t('close'),
                label: `${t('delete')} ${userNameToBeDeleted}`,
                textConfirmation: true,
                onRequestSubmit: async () => {
                    try {
                        const response = await authFetch(`${BaseURL}/user`, {
                            method: "DELETE",
                            body: JSON.stringify({
                                accountIDs: [parseInt(userIdToBeDeleted)],
                            })
                        });
                        if (response.ok) {
                            setNotification({
                                type: "success",
                                message: "User deleted successfully.",
                            });
                        } else {
                            throw "error";
                        }
                    } catch (error) {
                        setNotification({
                            type: "error",
                            message: "Error deleting user.",
                        });
                    } finally {
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
                body: t('delete-modal-bulk-heading'),
                className: "remove-modal-test",
                title: t('delete-modal-title'),
                iconDescription: t('delete-modal-icon'),
                inputInvalidText: t('delete-modal-invalid-input-text'),
                inputLabelText: `${t('delete-modal-input-label-text-1')} "delete" ${t('delete-modal-input-label-text-2')}`,
                inputPlaceholderText: "delete",
                open: true,
                onClose: () => {
                    setDeleteModalProps(null);
                    setUserListParams((prev) => {
                        setSearchParams(prev);
                        return {};
                    });
                },
                primaryButtonText: t('delete'),
                resourceName: "delete",
                secondaryButtonText: t('close'),
                label: t('delete-users'),
                textConfirmation: true,
                onRequestSubmit: async () => {
                    try {
                        const response = await authFetch(`${BaseURL}/user`, {
                            method: "DELETE",
                            body: JSON.stringify({
                                accountIDs: userIdsToBeDeleted,
                            })
                        });
                        if (response.ok) {
                            setNotification({
                                type: "success",
                                message: "User deleted successfully.",
                            });
                        } else {
                            throw "error";
                        }
                    } catch (error) {
                        setNotification({
                            type: "error",
                            message: "Error deleting user.",
                        });
                    } finally {
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
            if (prev.isUserListOpen !== "true") {
                setSearchParams({ isUserListOpen: true });
            } else {
                setSearchParams(prev);
            }
            return {};
        });
    }, []);

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
                {isUserManagementAllowed && editUserPanelOpen && <SidePanels />}
                {isUserManagementAllowed && addUserPanelOpen && <SidePanels />}
                {isUserManagementAllowed && userDetailsOpen && <UserDetailPanel />}
            </UserManagementContext.Provider>
            {deleteModalProps && <RemoveModal {...deleteModalProps} />}
        </>
    );
};

export { UserManagementContext, UserManagementProvider };

export const useUserManagement = () => useContext(UserManagementContext);
