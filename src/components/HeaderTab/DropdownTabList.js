import React, { useRef, useContext, useState, useEffect } from "react";
import {
    Button,
    ContainedList,
    ContainedListItem,
    PopoverContent,
    Popover,
    Search
} from "@carbon/react";
import "./DropdownTabList.scss";
import { TabContext } from "../../sdk";
import { ChevronDown20, Close16, Home16 } from "@carbon/icons-react";
import { useTranslation } from "react-i18next";

const DropdownTabList = ({ className }) => {
    const { t } = useTranslation();
    const { tab, handleRemoveTab, activeTab, setActiveTab } =
        useContext(TabContext);
    const dropdownTabsRef = useRef(null);
    const [isDropdownTabsOpen, setIsDropdownTabsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const handleSearchChange = event => {
        setSearchTerm(event.target.value);
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
            <div className={ `header-tab-list ${ className }` }>
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
                                        size="md"
                                        labelText={ "" } />
                                { searchResults.map((item, index) =>
                                    <ContainedListItem
                                        key={ `${ item.id }-${ index }` }
                                        className={ tab[activeTab].id === item.id ? 'list-item-active' : '' }
                                        action={
                                            item.isDelted ? (
                                                <>
                                                    <Button
                                                        label=""
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
                                                        label=""
                                                        kind="ghost"
                                                        className="home-tab-icon"
                                                        hasIconOnly
                                                        onClick={ () => {
                                                            handleTabListChange(item.id);
                                                            setIsDropdownTabsOpen(false);
                                                        } }
                                                    >
                                                        <Home16 width={ 13 } height={ 13 }></Home16>
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
export default DropdownTabList;
