import React, { useRef, useContext, useState, useEffect } from "react";
import {
    Button,
    ContainedList,
    ContainedListItem,
    Search
} from "@carbon/react";
import "./DropdownTabList.scss";
import { TabContext } from "../../sdk";
import { ChevronDown16, Close16, Home16 } from "@carbon/icons-react";
import { useTranslation } from "react-i18next";
import TabSkeleton from "carbon-web-components/es/components-react/tabs/tab-skeleton";

const DropdownTabList = ({ className }) => {
    const { t } = useTranslation();
    const { tab, handleRemoveTab, activeTab, setActiveTab } =
        useContext(TabContext);
    const dropdownTabsRef = useRef(null);
    const [isDropdownTabsOpen, setIsDropdownTabsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState(tab);
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
            <div ref={ dropdownTabsRef } className={ `header-tab-list ${ className ? className : '' }` }>
                <div
                    className={ "cds--dropdown__wrapper cds--list-box__wrapper cds--dropdown__wrapper--inline cds--list-box__wrapper--inline" }>
                    <div
                        className={ `cds--dropdown cds--dropdown--inline cds--dropdown--lg cds--list-box cds--list-box--lg ${ isDropdownTabsOpen ? 'cds--dropdown--open cds--list-box--expanded' : '' }` }>
                        <Button
                            kind="ghost"
                            className={ "cds--list-box__field" }
                            onClick={ () => {
                                setIsDropdownTabsOpen(!isDropdownTabsOpen);
                                setSearchTerm('');
                            } }>
                            <div className="cds--list-box__label">
                                {
                                    tab[activeTab].loaded ? (tab[activeTab].label) : (<TabSkeleton></TabSkeleton>)
                                }
                            </div>
                            <div
                                className={ `cds--list-box__menu-icon ${ isDropdownTabsOpen ? 'cds--list-box__menu-icon--open' : '' }` }>
                                <ChevronDown16 />
                            </div>

                        </Button>

                        <ul className="cds--list-box__menu" role="listbox">
                            <div className="header-dynamic-dropdown-tabs-content">
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
                                                                <Home16 />
                                                            </Button>
                                                        </>
                                                    )
                                                }
                                                onClick={ () => {
                                                    handleTabListChange(item.id);
                                                    setIsDropdownTabsOpen(false);
                                                } }
                                            >
                                                {
                                                    item.loaded ? (item.label) : (<TabSkeleton></TabSkeleton>)
                                                }
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
                            </div>
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
};
export default DropdownTabList;
