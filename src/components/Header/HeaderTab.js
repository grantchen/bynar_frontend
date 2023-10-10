import React, { useRef, useContext, useState, useEffect } from "react";
import {
    Button,
    TabList,
    Tabs,
    Tab,
    ContainedList,
    ContainedListItem,
    PopoverContent,
    Popover,
    Search
} from "@carbon/react";
import { Add20 } from '@carbon/icons-react';
import "./HeaderTab.scss";
import { TabContext } from "../../sdk";
import { ChevronDown20, Close20 } from "@carbon/icons-react";
import { useTranslation } from "react-i18next";
import TabSkeleton from "carbon-web-components/es/components-react/tabs/tab-skeleton";

const HeaderTab = ({ className }) => {
    const { t } = useTranslation();
    const { tab, handleAddTab, handleRemoveTab, activeTab, setActiveTab } =
        useContext(TabContext);
    const carouselRef = useRef(null);
    const dropdownTabsRef = useRef(null);
    const [isDropdownTabsOpen, setIsDropdownTabsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const handleChange = event => {
        setSearchTerm(event.target.value);
    };

    const handleTabChange = (evt) => {
        if (tab[evt.selectedIndex]?.loaded === true) {
            setActiveTab(evt.selectedIndex);
        }
    };

    const handleTabListChange = (tabId) => {
        const index = tab.findIndex((item) => item.id === tabId);
        if (tab[index]?.loaded === true) {
            setActiveTab(index);
        }
    };

    const removeTab = (tabId) => {
        handleRemoveTab(tabId);
    };

    useEffect(() => {
        const results = tab.filter(listItem => listItem.label.toLowerCase().includes(searchTerm.toLowerCase()));
        setSearchResults(results);
    }, [searchTerm, tab]);

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
                              onTabCloseRequest={ (index) => {
                                  removeTab(tab[index].id)
                              } }>
                            <TabList aria-label="List of tabs">
                                { tab.map((item, index) =>
                                    <Tab key={ index }
                                         className={ item.isDelted ? 'custom-tab' : 'custom-tab tab-stable' }>
                                        {
                                            item.loaded ? (item.label) : (<TabSkeleton></TabSkeleton>)
                                        }
                                    </Tab>
                                ) }
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
                        <div className="list-wrapper">
                            <ContainedList
                                label={ t("opened-tabs") }
                                size="md"
                            >
                                <Search placeholder={ t("filter") }
                                        value={ searchTerm }
                                        onChange={ handleChange }
                                        closeButtonLabelText={ t("clear") }
                                        size="md" />
                                { searchResults.map((item, index) =>
                                    <ContainedListItem
                                        key={ index }
                                        className={ tab[activeTab].id === item.id ? 'list-item-active' : '' }
                                        action={
                                            item.isDelted && (
                                                <Button
                                                    kind="ghost"
                                                    hasIconOnly
                                                    title={ t("close") }
                                                    onClick={ () => {
                                                        removeTab(item.id);
                                                    } }
                                                >
                                                    <Close20 />
                                                </Button>
                                            )
                                        }
                                        onClick={ () => {
                                            handleTabListChange(item.id);
                                            setIsDropdownTabsOpen(false);
                                        } }
                                    >{ item.label }
                                    </ContainedListItem>
                                ) }
                            </ContainedList>
                        </div>
                    </PopoverContent>
                </Popover>
            </div>
        </>
    );
};
export default HeaderTab;
