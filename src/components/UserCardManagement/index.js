import { SidePanel } from "@carbon/ibm-products";
import { ContainedList, Button, ContainedListItem, OverflowMenu, OverflowMenuItem } from '@carbon/react';
import { useState, useRef, useEffect } from "react";
import { Add20 } from "@carbon/icons-react";
import {
    ToastNotification,
} from "carbon-components-react";
import './UserCardManagement.scss'

import { useUserManagement } from "../../sdk";
import { notificationTokens } from "@carbon/themes";
import { Delete16 } from "@carbon/icons-react";
const UserCardManagement = ({ open }) => {
    const { closeModalAndGoBackToUserList, getUserCardList, openUserCardManagementModal, notification, openUserCardDeleteModal } = useUserManagement();
    const [cardList, setCardList] = useState([]);
    const [savingData, setSavingData] = useState(false);

    const handleClose = () => {
        closeModalAndGoBackToUserList();
    };

    useEffect(() => {
        if (!open) {
            return;
        }
        (async () => {
            setSavingData(true);
            const data = await getUserCardList();
            setCardList(data?.result);
        })();
    }, [open]);

    console.log(cardList, "testtt", cardList?.instruments)

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
                            label="List title"
                            kind="on-page"
                            action={
                                <Button
                                    hasIconOnly
                                    iconDescription="Add"
                                    renderIcon={Add20}
                                    tooltipPosition="left"
                                    // onClick={openUserCardManagementModal}
                                    onClick={() => {
                                        console.log("test delete");
                                        openUserCardDeleteModal({
                                            cardIdToBeDeleted: "src_g3xwcvhcljfebhi5pjsspcyqja",
                                            userName: "s1@yopmail.com",
                                        });
                                    }}
                                />
                            }>
                            {cardList?.instruments?.map((listItem, key) => (
                                <ContainedListItem
                                    action={
                                        <OverflowMenu floatingMenu flipped size="lg" ariaLabel="List item options">
                                            <OverflowMenuItem itemText="View details" />
                                            <OverflowMenuItem itemText="Remove" isDelete hasDivider
                                                onClick={() => {
                                                    console.log("test delete");
                                                    openUserCardDeleteModal({
                                                        cardIdToBeDeleted: listItem?.id,
                                                        userName: cardList?.email,
                                                    });
                                                }}
                                            />
                                        </OverflowMenu>
                                    }>
                                    {listItem?.scheme}
                                    {"...."}{listItem?.last4}
                                    {cardList?.name}
                                    {listItem?.expiry_month}/
                                    {listItem?.expiry_year}
                                </ContainedListItem>
                            ))}
                           
                        </ContainedList>
                    </div>
                </SidePanel>
            </div>
        </>)

}
export default UserCardManagement;