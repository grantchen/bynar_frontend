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

const UserManagementContext = createContext();

const UserManagementProvider = ({ children }) => {
    const { user, authFetch } = useAuth();
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
                body: `Deleting ${userNameToBeDeleted} will permanently delete the user. This action cannot be undone.`,
                className: "remove-modal-test",
                title: "Confirm delete",
                iconDescription: "close",
                inputInvalidText: "A valid value is required",
                inputLabelText: `Type ${userNameToBeDeleted} to confirm`,
                inputPlaceholderText: userNameToBeDeleted,
                open: true,
                onClose: () => {
                    setDeleteModalProps(null);
                    setUserListParams((prev) => {
                        setSearchParams(prev);
                        return {};
                    });
                },
                primaryButtonText: "Delete",
                resourceName: userNameToBeDeleted,
                secondaryButtonText: "Close",
                label: `Delete ${userNameToBeDeleted}`,
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
                body: `Confirming will permanently delete the users. This action cannot be undone.`,
                className: "remove-modal-test",
                title: "Confirm delete",
                iconDescription: "close",
                inputInvalidText: "A valid value is required",
                inputLabelText: `Type "delete users" to confirm`,
                inputPlaceholderText: "delete users",
                open: true,
                onClose: () => {
                    setDeleteModalProps(null);
                    setUserListParams((prev) => {
                        setSearchParams(prev);
                        return {};
                    });
                },
                primaryButtonText: "Delete",
                resourceName: "delete users",
                secondaryButtonText: "Close",
                label: `Delete Users`,
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
