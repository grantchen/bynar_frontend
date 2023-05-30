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
import UserCardManagement from "../../components/UserCardManagement";
import UserCardModal from "../UserCardModal";
import { Frames } from "frames-react";
const UserManagementContext = createContext();

const UserManagementProvider = ({ children }) => {
    const { user, authFetch } = useAuth();
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
    const cardManagementSidePanelOpen = Boolean(searchParams.get("openCardMangementPanel"));
    const userCardModalOpen = Boolean(searchParams.get("userCardModalOpen"));

    const isUserManagementAllowed = useMemo(
        () =>
            user &&
            !(
                user?.cognitoUserGroups === "Users" ||
                user?.cognitoUserGroups?.length === 0
            ),
        [user]
    );

    const isUserCardManagementAllowed = useMemo(
        () =>
            user &&
            (
                user?.cognitoUserGroups === "PrimaryOwner"
            ),
        [user]
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
                (res) => res.json()
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

    const openUserCardDeleteModal = useCallback(
        ({ cardIdToBeDeleted, userName }) => {
            console.log(cardIdToBeDeleted,userName,"opennnnn")
            if (!cardIdToBeDeleted || !userName) {
                return;
            }
            setUserListParams(mergeQueryParams(searchParams, {}));
            setSearchParams({ cardIdToBeDeleted, userName });
            setDeleteModalProps({
                body: `${t(
                    "delete-modal-heading-1"
                )} ${userName} ${t("delete-modal-heading-2")}`,
                className: "remove-modal-test",
                title: t("delete-modal-title"),
                iconDescription: t("delete-modal-icon"),
                inputInvalidText: t("delete-modal-invalid-input-text"),
                inputLabelText: `${t(
                    "delete-modal-input-label-text-1"
                )} "${userName}" ${t("delete-modal-input-label-text-2")}`,
                inputPlaceholderText: `${userName}`,
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
                resourceName: `${userName}`,
                secondaryButtonText: t("close"),
                label: `${t("delete")} ${userName}`,
                textConfirmation: true,
                onRequestSubmit: async () => {
                    try {
                        setLoading(true);
                        const response = await authFetch(`${BaseURL}/card/${cardIdToBeDeleted}`, {
                            method: "DELETE",
                        });
                        if (response.ok) {
                            setNotification({
                                type: "success",
                                message: t("card-deleted-successfully"),
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
    }, []);

    const openCardManagementSidePanel= useCallback(
        () => {
            setUserListParams(mergeQueryParams(searchParams, {}));
            setSearchParams({ openCardMangementPanel: true })
        },
    [searchParams]);

    const getUserCardList= useCallback(
        async () => {
            try {
                const response = await authFetch(`${BaseURL}/card`, {
                    method: "GET",
                });
                if (response.ok) {
                    const res = await response.json();
                    return res;
                } else {
                    throw "error";
                }
            } catch (error) {
                setNotification({
                    type: "error",
                    message: t("error-deleting-card"),
                });
            } finally {
            }
        },
        [authFetch]
    );

    const openUserCardManagementModal= useCallback(
        () => {
            setUserListParams(mergeQueryParams(searchParams, {}));
            setSearchParams({ userCardModalOpen: true })
        },
    [searchParams]);

    const handleVerifyCard= useCallback(
        async (token) => {
            console.log("token",token)
            const data = {
               token:token
              };
            const response = await authFetch(`${BaseURL}/verify-card`, {
                method: "POST",
                body: JSON.stringify(data),
            });

            const res = await response.json();

            if (response.ok) {
                closeModalAndGoBackToUserList();
            } else if (response.status === 500) {
                throw { message: res.error, type: "error" };
            } else {
                throw { message: t("error-adding-user-card"), type: "error" };
            }
        },
        [authFetch]
    );

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
            openCardManagementSidePanel,
            getUserCardList,
            openUserCardManagementModal,
            handleVerifyCard,
            openUserCardDeleteModal,
            isUserCardManagementAllowed,
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
            openCardManagementSidePanel,
            getUserCardList,
            openUserCardManagementModal,
            handleVerifyCard,
            openUserCardDeleteModal,
            isUserCardManagementAllowed
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
                {isUserManagementAllowed && (
                    <UserDetailPanel open={userDetailsOpen} />
                )}
                {isUserCardManagementAllowed && <UserCardManagement open={cardManagementSidePanelOpen}/>}
                {isUserCardManagementAllowed && <UserCardModal open={userCardModalOpen}/>}           
            </UserManagementContext.Provider>
            {deleteModalProps && <RemoveModalWithLoading deleteModalProps={deleteModalProps} loading={loading} />}

        </>
    );
};

export { UserManagementContext, UserManagementProvider };

export const useUserManagement = () => useContext(UserManagementContext);
