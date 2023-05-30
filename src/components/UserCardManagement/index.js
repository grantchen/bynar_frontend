import { SidePanel } from "@carbon/ibm-products";
import { ContainedList, Button, ContainedListItem, OverflowMenu, OverflowMenuItem, Grid, Column, SkeletonText } from '@carbon/react';
import { useState, useRef, useEffect } from "react";
import { Add20, CheckmarkFilled16 } from "@carbon/icons-react";
import {
    SkeletonPlaceholder,
    ToastNotification,
} from "carbon-components-react";
import './UserCardManagement.scss'
import { TextInputSkeleton } from "@carbon/react";

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
            setSavingData(false)
        })();
    }, [open]);

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
                            label="Payment method"
                            kind="on-page"
                            action={
                                <Button
                                    hasIconOnly
                                    iconDescription="Add"
                                    renderIcon={Add20}
                                    tooltipPosition="left"
                                    onClick={openUserCardManagementModal}
                                    disabled={cardList?.instruments.length > 10 ? true : false}
                                // onClick={() => {
                                //     console.log("test delete");
                                //     openUserCardDeleteModal({
                                //         cardIdToBeDeleted: "src_g3xwcvhcljfebhi5pjsspcyqja",
                                //         userName: "s1@yopmail.com",
                                //     });
                                // }}
                                />
                            }>
                            {cardList?.instruments?.map((listItem, key) => (
                                <ContainedListItem
                                    action={
                                        <OverflowMenu floatingMenu flipped size="lg" ariaLabel="List item options">
                                            <OverflowMenuItem itemText="Default payment method" />
                                            <OverflowMenuItem itemText="Remove payment method" isDelete hasDivider
                                                onClick={() => {
                                                    console.log("test delete");
                                                    openUserCardDeleteModal({
                                                        cardIdToBeDeleted: listItem?.id,
                                                        userName: cardList?.email,
                                                    });
                                                }}
                                            />
                                        </OverflowMenu>
                                    }
                                    key={key}
                                >
                                   {savingData?(
                                     <SkeletonText heading={true} className="skeleton-loading" />
                                   ):( <div className="card-box">
                                        <div>
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 10
                                            }}>
                                                {listItem?.scheme}
                                                {listItem?.id === cardList?.default ? <CheckmarkFilled16 /> : <div style={{
                                                    width:'16px'
                                                }}></div>}
                                            </div>
                                        </div>
                                        <p>{"...."}{listItem?.last4}</p>
                                        <p>{cardList?.name}</p>
                                        <p>{listItem?.expiry_month}/{listItem?.expiry_year}</p>
                                    </div>)}
                                </ContainedListItem>
                            ))}

                        </ContainedList>
                    </div>
                </SidePanel>
            </div>
        </>)

}
export default UserCardManagement;