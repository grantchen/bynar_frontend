import React, { useRef, useContext, useState, useEffect } from "react";
import { Button, TabList, Tabs, Tab, ContainedList, ContainedListItem, PopoverContent, Popover } from "@carbon/react";
import { Add20 } from '@carbon/icons-react';
import "./HeaderTab.scss";
import { TabContext } from "../../sdk";
import { ChevronDown20, Close20 } from "@carbon/icons-react";
import { useTranslation } from "react-i18next";

const HeaderTab = ({ className }) => {
    const { t } = useTranslation();
    const { tab, handleAddTab, handleRemoveTab, activeTab, setActiveTab } =
        useContext(TabContext);
    const carouselRef = useRef(null);
    const dropdownTabsRef = useRef(null);
    const [isDropdownTabsOpen, setIsDropdownTabsOpen] = useState(false);

    const handleTabChange = (evt) => {
        setActiveTab(evt.selectedIndex);
    };

    const removeTab = (index) => {
        handleRemoveTab(tab[index].id, index);
    };

    useEffect(() => {
        const handleClickDropdownTabsOutside = (event) => {
            if (
                dropdownTabsRef.current &&
                !dropdownTabsRef.current.contains(event.target)
            ) {
                setIsDropdownTabsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickDropdownTabsOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickDropdownTabsOutside);
        };
    }, []);

    return (
        <>
            <div className={ `header-dynamic-tab ${ className }` }>
                <div className="tab-buttons-list" ref={ carouselRef }>
                    <div style={ { display: "flex", whiteSpace: "nowrap", height: "100%" } }>
                        <Tabs selectedIndex={ activeTab } onChange={ handleTabChange } dismissable
                              onTabCloseRequest={ removeTab }>
                            <TabList aria-label="List of tabs">
                                { tab.map((item, index) =>
                                    <Tab key={ index }
                                         className={ item.isDelted ? 'custom-tab' : 'custom-tab tab-stable' }>
                                        { item.label }
                                    </Tab>) }
                            </TabList>
                        </Tabs>
                    </div>
                </div>

                <Button
                    kind="ghost"
                    className="add-new-tab"
                    hasIconOnly
                    onClick={ (e) => handleAddTab() }
                >
                    <Add20 aria-label="Add" />
                </Button>

                <Popover
                    ref={ dropdownTabsRef }
                    open={ isDropdownTabsOpen }
                >
                    <Button
                        kind="ghost"
                        hasIconOnly
                        onClick={ () => {
                            setIsDropdownTabsOpen(!isDropdownTabsOpen);
                        } }>
                        <ChevronDown20 />
                    </Button>
                    <PopoverContent className="header-dynamic-dropdown-tabs-content">
                        <ContainedList
                            label={ t('opened-tabs') }
                            size="md"
                        >
                            { tab.map((item, index) =>
                                <ContainedListItem
                                    key={ index }
                                    className={activeTab === index ? 'list-item-active' : ''}
                                    action={
                                        item.isDelted && (
                                            <Button
                                                kind="ghost"
                                                hasIconOnly
                                                iconDescription={ t('close') }
                                                onClick={ () => {
                                                    removeTab(index);
                                                } }
                                            >
                                                <Close20 />
                                            </Button>
                                        )
                                    }
                                    onClick={ () => {
                                        setActiveTab(index);
                                        setIsDropdownTabsOpen(false);
                                    } }
                                >{ item.label }
                                </ContainedListItem>
                            ) }
                        </ContainedList>
                    </PopoverContent>
                </Popover>
            </div>
        </>
    );
};
export default HeaderTab;
