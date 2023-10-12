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
import { ChevronDown20, Close16, Home16 } from "@carbon/icons-react";
import { useTranslation } from "react-i18next";
import TabSkeleton from "carbon-web-components/es/components-react/tabs/tab-skeleton";

const TabIcon = (tabItem, handleRemoveTab) => {
    const { t } = useTranslation();

    return (
        <>
            {
                tabItem.isDelted ? (
                    <>
                        {/* use native dismissable because of Chevron scroll misbehave */ }
                    </>
                ) : (
                    tabItem.name === "Dashboard" &&
                    <>
                        <Home16></Home16>
                    </>
                )
            }
        </>
    )
}


const HeaderTab = ({ className }) => {
    const { t } = useTranslation();
    const { tab, handleAddTab, handleRemoveTab, activeTab, setActiveTab } =
        useContext(TabContext);
    const carouselRef = useRef(null);
    const dropdownTabsRef = useRef(null);
    const [isDropdownTabsOpen, setIsDropdownTabsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const handleSearchChange = event => {
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
                        <Tabs selectedIndex={ activeTab }
                              onChange={ handleTabChange }
                              dismissable
                              onTabCloseRequest={ (index) => {
                                  removeTab(tab[index].id)
                              } }
                        >
                            <TabList aria-label="List of tabs">
                                { tab.map((item, index) =>
                                    <Tab key={ `${ item.id }-${ index }` }
                                         renderIcon={ () => {
                                             return TabIcon(item, removeTab)
                                         } }
                                         className={ `custom-tab ${ !item.isDelted ? 'tab-stable' : '' } ${ item.name === 'Dashboard' ? 'tab-icon-reverse' : '' }` }>
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
                            setSearchTerm('');
                        } }>
                        <ChevronDown20 />
                    </Button>
                    <PopoverContent className="header-dynamic-dropdown-tabs-content">
                        <div className="list-wrapper">
                            <ContainedList
                                label={ "" }
                                size="md"
                            >
                                <Search placeholder={ t("search-tabs") }
                                        value={ searchTerm }
                                        onChange={ handleSearchChange }
                                        closeButtonLabelText={ t("clear") }
                                        size="md" />
                                { searchResults.map((item, index) =>
                                    <ContainedListItem
                                        key={ `${ item.id }-${ index }` }
                                        className={ tab[activeTab].id === item.id ? 'list-item-active' : '' }
                                        action={
                                            item.isDelted ? (
                                                <>
                                                    <Button
                                                        kind="ghost"
                                                        className="close-list-tab"
                                                        hasIconOnly
                                                        title={ t("close") }
                                                        onClick={ () => {
                                                            removeTab(item.id);
                                                        } }
                                                    >
                                                        <Close16 />
                                                    </Button>
                                                </>
                                            ) : (
                                                item.name === "Dashboard" && <>
                                                    <Button
                                                        kind="ghost"
                                                        className="home-tab-icon"
                                                        hasIconOnly
                                                        onClick={ () => {
                                                            handleTabListChange(item.id);
                                                            setIsDropdownTabsOpen(false);
                                                        } }
                                                    >
                                                        <Home16></Home16>
                                                    </Button>
                                                </>
                                            )
                                        }
                                        onClick={ () => {
                                            handleTabListChange(item.id);
                                            setIsDropdownTabsOpen(false);
                                        } }
                                    >{ item.label }
                                    </ContainedListItem>
                                ) }
                                {
                                    searchResults.length === 0 && (
                                        <ContainedListItem>
                                            { t("no-results-found") }
                                        </ContainedListItem>
                                    )
                                }
                            </ContainedList>
                        </div>
                    </PopoverContent>
                </Popover>
            </div>
        </>
    );
};
export default HeaderTab;
