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

const UserManagementContext = createContext();

const UserManagementProvider = ({ children }) => {
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

    const getUserList = useCallback(async (queryParams = {}) => {
        setLoading(true);
        const token = localStorage.getItem("token"); //todo
        try {
            const searchQueryParams = new URLSearchParams(
                removeNullEntries(queryParams)
            ).toString();

            const response = await fetch(
                `${BaseURL}/list-users?${searchQueryParams}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + token,
                    },
                }
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
    }, []);

    const deleteUser = useCallback(
        async (ids) => {
            setLoading(true);
            const token = localStorage.getItem("token");
            try {
                const response = await fetch(`${BaseURL}/user`, {
                    method: "DELETE",
                    body: JSON.stringify({ accountIDs: [...ids] }),
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + token,
                    },
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
        [getUserList]
    );

    const updateUser = useCallback(async ({ userDetails }) => {
        const token = localStorage.getItem("token"); //todo
        const response = await fetch(`${BaseURL}/user`, {
            method: "PUT",
            body: JSON.stringify(userDetails),
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
        });

        const res = await response.json();

        if (response.ok) {
            closeModalAndGoBackToUserList();
        } else if (response.status === 500) {
            throw { message: res.error, type: "error" };
        } else {
            throw { message: "Error updating user", type: "error" };
        }
    });
    const addUser = useCallback(async ({ userDetails }) => {
        const token = localStorage.getItem("token"); //todo
        const response = await fetch(`${BaseURL}/user`, {
            method: "POST",
            body: JSON.stringify(userDetails),
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
        });

        const res = await response.json();

        if (response.ok) {
            closeModalAndGoBackToUserList();
        } else if (response.status === 500) {
            throw { message: res.error, type: "error" };
        } else {
            throw { message: "Error updating user", type: "error" };
        }
    });

    const getUserById = useCallback(async (id) => {
        const token = localStorage.getItem("token");
        const response = await fetch(
            `${BaseURL}/user/${id}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                },
            }
        ).then(res => res.json())
        return response
    }, [])

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
                        const token = localStorage.getItem("token"); //todo
                        const response = await fetch(`${BaseURL}/user`, {
                            method: "DELETE",
                            body: JSON.stringify({
                                accountIDs: [parseInt(userIdToBeDeleted)],
                            }),
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: "Bearer " + token,
                            },
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
        [searchParams]
    );

    const openBulkDeleteConfirmModal = useCallback(({userIdsToBeDeleted = []}) => {
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
            inputPlaceholderText: 'delete users',
            open: true,
            onClose: () => {
                setDeleteModalProps(null);
                setUserListParams((prev) => {
                    setSearchParams(prev);
                    return {};
                });
            },
            primaryButtonText: "Delete",
            resourceName: 'delete users',
            secondaryButtonText: "Close",
            label: `Delete Users`,
            textConfirmation: true,
            onRequestSubmit: async () => {
                try {
                    const token = localStorage.getItem("token"); //todo
                    const response = await fetch(`${BaseURL}/user`, {
                        method: "DELETE",
                        body: JSON.stringify({
                            accountIDs: userIdsToBeDeleted,
                        }),
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: "Bearer " + token,
                        },
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
    }, [searchParams])

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

    const openUserDetails = useCallback(({userIdToShowDetails}) => {
        if(!userIdToShowDetails){
            return
        }
        setUserListParams(mergeQueryParams(searchParams, {}));
        setSearchParams({ userIdToShowDetails });
    }, [searchParams])

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
            openBulkDeleteConfirmModal
        }),
        [
            userListData,
            getUserList,
            deleteUser,
            loading,
            openDeleteModal,
            notification,
            openEditPanel,
            closeModalAndGoBackToUserList,
            updateUser,
            openAddUserModel,
            addUser,
            openUserDetails,
            getUserById,
            openBulkDeleteConfirmModal
        ]
    );

    /**todo remove this whole block later */
    const [userHasPermission, setUserHasPermission] = useState(false);
    useEffect(() => {
        (async () => {
            try {
                const token = localStorage.getItem("token"); //todo
                const response = await fetch(`${BaseURL}/user`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + token,
                    },
                });

                if (response.ok) {
                    const res = await response.json();
                    if (
                        res?.result.cognitoUserGroups === "Users" ||
                        res?.result.cognitoUserGroups.length == 0
                    ) {
                        setUserHasPermission(false);
                    } else {
                        setUserHasPermission(true);
                    }
                }
            } catch (e) {}
        })();
    }, []);
    return (
        <>
            <UserManagementContext.Provider value={value}>
                {children}
                {userHasPermission && editUserPanelOpen && <SidePanels />}
                {userHasPermission && addUserPanelOpen && <SidePanels />}
                {userHasPermission && userDetailsOpen && <UserDetailPanel />}
            </UserManagementContext.Provider>
            {deleteModalProps && <RemoveModal {...deleteModalProps} />}
        </>
    );
};

export { UserManagementContext, UserManagementProvider };

export const useUserManagement = () => useContext(UserManagementContext);
