import { SidePanel} from "@carbon/ibm-products";
import {ContainedList,Button,ContainedListItem,OverflowMenu,OverflowMenuItem} from '@carbon/react';
import { useState, useRef, useEffect } from "react";
import { Add20 } from "@carbon/icons-react";

import { useUserManagement } from "../../sdk";
const UserCardManagement = ({ open }) => {
    const { closeModalAndGoBackToUserList } = useUserManagement();

    const handleClose = () => {
        closeModalAndGoBackToUserList();
    };

    const listItems = [
        'List item 1',
        'List item 2',
        'List item 3',
        'List item 4'
      ];

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
                    <ContainedList
                        label="List title"
                        kind="on-page"
                        action={
                            <Button
                                hasIconOnly
                                iconDescription="Add"
                                renderIcon={Add20}
                                tooltipPosition="left"
                            />
                        }>
                        {listItems.map((listItem, key) => (
                            <ContainedListItem 
                            action={
                                <OverflowMenu floatingMenu flipped size="lg" ariaLabel="List item options">
                                    <OverflowMenuItem itemText="View details" />
                                    <OverflowMenuItem itemText="Edit" />
                                    <OverflowMenuItem itemText="Remove" isDelete hasDivider />
                                </OverflowMenu>
                            }>
                                {listItem}
                            </ContainedListItem>
                        ))}
                    </ContainedList>
                </SidePanel>
            </div>
        </>)

}
export default UserCardManagement;