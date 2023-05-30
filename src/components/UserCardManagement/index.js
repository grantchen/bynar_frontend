import { SidePanel } from "@carbon/ibm-products";
import {
    ContainedList,
    Button,
    ContainedListItem,
    OverflowMenu,
    OverflowMenuItem,
    Grid,
    Column,
    SkeletonText,
    Popover,
    PopoverContent,
    IconButton,
} from "@carbon/react";
import { OverflowMenuVertical } from "@carbon/react/icons";
import { useState, useRef, useEffect, useCallback } from "react";
import { Add20, CheckmarkFilled16 } from "@carbon/icons-react";
import {
    SkeletonPlaceholder,
    ToastNotification,
} from "carbon-components-react";
import "./UserCardManagement.scss";
import { TextInputSkeleton } from "@carbon/react";

import { BaseURL, useAuth, useUserManagement } from "../../sdk";
import { notificationTokens } from "@carbon/themes";
import { Delete16 } from "@carbon/icons-react";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
const UserCardManagement = ({ open }) => {
    const {
        closeModalAndGoBackToUserList,
        getUserCardList,
        openUserCardManagementModal,
        notification,
        openUserCardDeleteModal,
    } = useUserManagement();
    const { authFetch } = useAuth();
    const [cardList, setCardList] = useState([]);
    const [savingData, setSavingData] = useState(false);

    const [openOptionIndex, setOpenOptionIndex] = useState(-1);
    const { t } = useTranslation();

    const handleClose = () => {
        closeModalAndGoBackToUserList();
    };

    const handleDefaultCardOptionClick = useCallback(
        async (cardId) => {
            try {
                setOpenOptionIndex(-1);
                setSavingData(true);
                await authFetch(`${BaseURL}/card/${cardId}`, {
                    method: "PUT",
                });
                const data = await getUserCardList();
                setCardList(data?.result);
            } catch (error) {
                //todo show notification
            } finally {
                setSavingData(false);
            }
        },
        [authFetch]
    );

    useEffect(() => {
        if (!open) {
            return;
        }
        (async () => {
            setSavingData(true);
            const data = await getUserCardList();
            setCardList(data?.result);
            setSavingData(false);
        })();
    }, [open]);

    const wrapperRef = useRef(null);
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                wrapperRef.current &&
                !wrapperRef.current.contains(event.target)
            ) {
                setOpenOptionIndex(-1);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <>
            <div>
                <SidePanel
                    preventCloseOnClickOutside
                    includeOverlay
                    className="test"
                    open={open}
                    onRequestClose={handleClose}
                    subtitle=""
                >
                    <div className="card-list">
                        {notification && (
                            <ToastNotification
                                className="error-notification-box"
                                iconDescription="Close Notification"
                                subtitle={notification?.message}
                                timeout={0}
                                title={""}
                                kind={notification.type}
                            />
                        )}
                        <ContainedList
                            label={t("payment-method")}
                            action={
                                <Button
                                    hasIconOnly
                                    iconDescription={t("add-new-card")}
                                    renderIcon={Add20}
                                    tooltipPosition="left"
                                    onClick={openUserCardManagementModal}
                                    disabled={
                                        cardList?.instruments?.length >= 10
                                            ? true
                                            : false
                                    }
                                    // onClick={() => {
                                    //     console.log("test delete");
                                    //     openUserCardDeleteModal({
                                    //         cardIdToBeDeleted: "src_g3xwcvhcljfebhi5pjsspcyqja",
                                    //         userName: "s1@yopmail.com",
                                    //     });
                                    // }}
                                />
                            }
                        >
                            {cardList?.instruments?.map((listItem, index) => {
                                const date = new Date()
                                date.setFullYear(listItem.expiry_year)
                                date.setMonth(listItem.expiry_month)
                                return (
                                    <ContainedListItem
                                        action={
                                            <Popover
                                                open={openOptionIndex === index}
                                                align="bottom-right"
                                                dropShadow
                                                className="card-row-popover"
                                            >
                                                <IconButton
                                                    onClick={() =>
                                                        setOpenOptionIndex(
                                                            index
                                                        )
                                                    }
                                                    kind="ghost"
                                                >
                                                    <OverflowMenuVertical />
                                                </IconButton>
                                                {openOptionIndex === index && (
                                                    <PopoverContent
                                                        className="card-popver-content"
                                                        ref={wrapperRef}
                                                    >
                                                        <OverflowMenuItem
                                                            className="test"
                                                            itemText={t(
                                                                "default-payment-method"
                                                            )}
                                                            onClick={() =>
                                                                handleDefaultCardOptionClick(
                                                                    listItem?.id
                                                                )
                                                            }
                                                            disabled={listItem?.id === cardList?.default}
                                                        />
                                                        <OverflowMenuItem
                                                            itemText={t(
                                                                "remove-payment-method"
                                                            )}
                                                            isDelete
                                                            hasDivider
                                                            disabled={listItem?.id === cardList?.default}
                                                            onClick={() => {
                                                                openUserCardDeleteModal(
                                                                    {
                                                                        cardIdToBeDeleted:
                                                                            listItem?.id,
                                                                        last4Digit:
                                                                            listItem?.last4,
                                                                    }
                                                                );
                                                                setOpenOptionIndex(
                                                                    -1
                                                                );
                                                            }}
                                                        />
                                                    </PopoverContent>
                                                )}
                                            </Popover>
                                        }
                                        key={index}
                                    >
                                        {savingData ? (
                                            <SkeletonText
                                                heading={true}
                                                className="skeleton-loading"
                                            />
                                        ) : (
                                            <div className="card-box">
                                                <div>
                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            alignItems:
                                                                "center",
                                                            gap: 20,
                                                        }}
                                                    >
                                                        {listItem?.scheme}
                                                        {listItem?.id ===
                                                        cardList?.default ? (
                                                            <CheckmarkFilled16 />
                                                        ) : (
                                                            <div
                                                                style={{
                                                                    width: "16px",
                                                                }}
                                                            ></div>
                                                        )}
                                                    </div>
                                                </div>
                                                <p>
                                                    {"...."}
                                                    {listItem?.last4}
                                                </p>
                                                <p>{cardList?.name}</p>
                                                <p>
                                                    {format(date, 'MM/yyyy')}
                                                </p>
                                            </div>
                                        )}
                                    </ContainedListItem>
                                );
                            })}
                        </ContainedList>
                    </div>
                </SidePanel>
            </div>
        </>
    );
};
export default UserCardManagement;
