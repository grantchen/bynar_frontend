import React, { useRef, useContext, useState, useEffect, useCallback } from "react";
import {
    Button,
    ContainedList,
    ContainedListItem,
    Search
} from "@carbon/react";
import "./DropdownServiceList.scss";
import { TabContext, useAuth, useCardManagement } from "../../sdk";
import { Add } from "@carbon/react/icons";
import { useTranslation } from "react-i18next";
import jsonData from '../JSONs/wide-menus.json';
import { useOrganizationAccount } from "../../sdk/context/OrganizationAccountManagementContext";
import throttle from "lodash/throttle";

// DropdownServiceList is a dropdown list component including all the services
const DropdownServiceList = () => {
    const { t } = useTranslation();
    const { hasPermission } = useAuth();
    const { goToTab, tab } = useContext(TabContext);
    const { openCardManagementPanel, isCardManagementAllowed } = useCardManagement();
    const { openOrganizationAccountPanel, isOrganizationAccountAllowed } = useOrganizationAccount();

    const dropdownServicesRef = useRef(null);
    const dropdownListBoxRef = useRef(null);
    const [isDropdownTabsOpen, setIsDropdownTabsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [allMenuItems, setAllMenuItems] = useState([]);
    const [searchResults, setSearchResults] = useState([]);

    // check if the menu item has permission to be displayed
    const hasLinkPermission = useCallback((menuItem) => {
        if (menuItem.sidePanel === "OrganizationAccountPanel") {
            return isOrganizationAccountAllowed
        }

        if (menuItem.sidePanel === "UserCardManagementPanel") {
            return isCardManagementAllowed
        }

        return !menuItem.permission || hasPermission(menuItem.permission, "list")
    }, [hasPermission, isOrganizationAccountAllowed, isCardManagementAllowed])

    // open side panel for click menu item
    const openSidePanel = (menuItem) => {
        switch (menuItem.sidePanel) {
            case "UserCardManagementPanel":
                openCardManagementPanel()
                break
            case "OrganizationAccountPanel":
                openOrganizationAccountPanel()
                break
            default:
                break
        }
    }

    // open the service tab/panel when click on the service
    const openService = (item) => {
        if (item.tab) {
            goToTab(item.tab, item.title, item.tabType)
        } else if (item.sidePanel) {
            openSidePanel(item)
        } else {
            window.open(item.url, '_blank')
        }
    };

    // set search term when search input changes
    const handleSearchChange = event => {
        setSearchTerm(event.target.value);
    };

    // set all menu items from jsonData
    useEffect(() => {
        const allMenuItems = (
            jsonData.mastheadNav.links.find((item) => item.title === 'explore-more')?.menuSections[0]?.menuItems || []
        ).filter((item) => {
            return hasLinkPermission(item) && !item.megaPanelViewAll
        });
        setAllMenuItems(allMenuItems);
    }, [hasLinkPermission]);

    // filter tab list when search term changes
    useEffect(() => {
        const results = allMenuItems.filter(listItem => t(listItem.title).toLowerCase().includes(searchTerm.toLowerCase()));
        setSearchResults(results);
    }, [searchTerm, allMenuItems]);

    // close the dropdown when clicked outside
    useEffect(() => {
        const handleClickDropdownServicesOutside = (event) => {
            if (
                dropdownServicesRef.current &&
                !dropdownServicesRef.current.contains(event.target)
            ) {
                setIsDropdownTabsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickDropdownServicesOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickDropdownServicesOutside);
        };
    }, []);

    // fit the dropdown list position
    const fitDropdownListPosition = throttle(() => {
        if (!dropdownServicesRef.current || !dropdownListBoxRef.current) return

        const windowWith = window.innerWidth
        // the distance between the add button and the left side of the window
        const addButtonLeft = dropdownServicesRef.current.getBoundingClientRect().left
        // space width between the add button left and the right side of the window
        const spaceWidth = windowWith - addButtonLeft
        // if the dropdown list width is larger than the space width,
        // set the dropdown shown on the left side of the add button
        if (spaceWidth < dropdownListBoxRef.current.offsetWidth) {
            dropdownListBoxRef.current.style.left = "unset"
        } else {
            dropdownListBoxRef.current.style.left = `0`
        }
    }, 200)

    // fit the dropdown list position when tabs changed
    useEffect(() => {
        fitDropdownListPosition()
    }, [tab])

    // fit the dropdown list position when window resize
    useEffect(() => {
        window.addEventListener('resize', fitDropdownListPosition)
        return () => window.removeEventListener('resize', fitDropdownListPosition)
    }, [])

    return (
        <>
            <div ref={ dropdownServicesRef } className={ `header-dropdown-services-list` }>
                <div
                    className={ "cds--dropdown__wrapper cds--list-box__wrapper cds--dropdown__wrapper--inline cds--list-box__wrapper--inline" }>
                    <div
                        className={ `cds--dropdown cds--dropdown--inline cds--dropdown--lg cds--list-box cds--list-box--lg ${ isDropdownTabsOpen ? 'cds--dropdown--open cds--list-box--expanded' : '' }` }>
                        <Button
                            label={ "" }
                            kind="ghost"
                            className="add-new-tab"
                            hasIconOnly
                            onClick={ () => {
                                setIsDropdownTabsOpen(true);
                                setSearchTerm('');
                            } }>
                            <Add size={ 20 } aria-label="Add" />
                        </Button>

                        <ul className="cds--list-box__menu" ref={ dropdownListBoxRef } role="listbox"
                            style={ { maxHeight: isDropdownTabsOpen ? '16.5rem' : 0 } }>
                            <div className="header-dynamic-dropdown-services-content">
                                <div className="list-wrapper">
                                    <ContainedList
                                        label={ "" }
                                        size="md"
                                    >
                                        <Search placeholder={ t("search-services") }
                                                value={ searchTerm }
                                                onChange={ handleSearchChange }
                                                closeButtonLabelText={ t("clear") }
                                                size="md"
                                                labelText={ "" } />
                                        { searchResults.map((item) =>
                                            <ContainedListItem
                                                key={ item.title }
                                                onClick={ () => {
                                                    openService(item)
                                                    setIsDropdownTabsOpen(false);
                                                } }
                                            >
                                                { t(item.title) }
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
export default DropdownServiceList;
