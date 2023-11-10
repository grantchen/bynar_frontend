import React, { useState, useEffect, useRef, useContext, useCallback, Fragment } from 'react';
import jsonData from '../JSONs/wide-menus.json';
import { ArrowRight } from "@carbon/react/icons";
import { TabContext, useAuth, useMobile, useCardManagement } from "../../sdk";
import '@carbon/ibmdotcom-web-components/es/components/masthead/left-nav.js';
import '@carbon/ibmdotcom-web-components/es/components/masthead/left-nav-menu.js';
import '@carbon/ibmdotcom-web-components/es/components/masthead/left-nav-menu-item.js';
import '@carbon/ibmdotcom-web-components/es/components/masthead/left-nav-overlay.js';
import "./CustomWideMenu.scss";
import { useTranslation } from "react-i18next";
import { useOrganizationAccount } from "../../sdk/context/OrganizationAccountManagementContext";

// CustomWideMenu is the drop down(left in mobile) menu in the header
export function CustomWideMenu({ expanded, onClickSideNavExpand, children }) {
    const { goToTab } = useContext(TabContext);
    const { openCardManagementPanel, isCardManagementAllowed } = useCardManagement();
    const { openOrganizationAccountPanel, isOrganizationAccountAllowed } = useOrganizationAccount();

    const [activeTitle, setActiveTitle] = useState(jsonData.mastheadNav.links[0]?.title);
    const [viewAllArray, setViewAllArray] = useState([])
    const leftNavRef = useRef(null)
    const wideMenuRef = useRef(null);
    const wideMenuButtonRef = useRef(null);

    const isMobile = useMobile();
    const { t } = useTranslation();
    const { hasPermission } = useAuth();

    // set active tab by title
    const handleClickTab = (title) => {
        setActiveTitle(title);
    };

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

    // check if the menu item has permission to be displayed
    const hasLinkPermission = useCallback((menuItem) => {
        if (menuItem.sidePanel === "OrganizationAccountPanel") {
            return isOrganizationAccountAllowed
        }
        if (menuItem.tab === "InvoiceList") {
            return isOrganizationAccountAllowed
        }

        if (menuItem.sidePanel === "UserCardManagementPanel") {
            return isCardManagementAllowed
        }

        return !menuItem.permission || hasPermission(menuItem.permission, "list")
    }, [hasPermission, isOrganizationAccountAllowed, isCardManagementAllowed])

    // expand/collapse wide menu in pc
    useEffect(() => {
        if (!isMobile) {
            return
        }

        if (!leftNavRef.current) {
            return
        }

        if (expanded) {
            leftNavRef.current.setAttribute("expanded", true);
        } else {
            leftNavRef.current.removeAttribute("expanded");
        }
    }, [expanded, isMobile]);

    // search tabs in drop down menus
    useEffect(() => {
        if (isMobile) {
            return
        }
        const filteredItems = jsonData.mastheadNav.links.flatMap((ele) => {
            if (ele.menuSections.length && ele.title === activeTitle) {
                return ele.menuSections[0]?.menuItems.filter((item) => item.megaPanelViewAll);
            }
            return [];
        });
        setViewAllArray(filteredItems);
    }, [activeTitle, isMobile]);

    useEffect(() => {
        // Close wide menu when clicked outside
        const handleClickWideMenuOutside = (event) => {
            if (
                wideMenuButtonRef.current &&
                !wideMenuButtonRef.current.contains(event.target) &&
                (
                    (wideMenuRef.current && // pc
                        !wideMenuRef.current.contains(event.target)) ||
                    (leftNavRef.current && // mobile
                        !leftNavRef.current.contains(event.target))
                )
            ) {
                if (expanded) {
                    onClickSideNavExpand()
                }
            }
        };
        document.addEventListener("mousedown", handleClickWideMenuOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickWideMenuOutside);
        };
    }, [expanded, onClickSideNavExpand]);

    return (
        <>
            {
                isMobile ? (
                    <>
                        <div ref={ wideMenuButtonRef }>{ children }</div>
                        <dds-left-nav-overlay></dds-left-nav-overlay>
                        <dds-left-nav
                            ref={ leftNavRef }
                            data-autoid="dds--masthead__l0-sidenav"
                            collapse-mode="responsive"
                            usage-mode="header-nav"
                        >
                            {/* first level menus section */ }
                            <dds-left-nav-menu-section
                                section-id={ `-1, -1` }
                                ariaHidden={ true }
                            >
                                {
                                    jsonData.mastheadNav.links.map((ele, i) => {
                                        return (
                                            <Fragment key={ ele.title }>
                                                <dds-left-nav-menu
                                                    title={ t(ele.title) }
                                                    panel-id={ `${ i }, -1` }
                                                ></dds-left-nav-menu>
                                            </Fragment>
                                        )
                                    })
                                }
                            </dds-left-nav-menu-section>

                            {
                                // sub menus section
                                jsonData.mastheadNav.links.map((ele, i) => {
                                    return (
                                        <Fragment key={ ele.title }>
                                            <dds-left-nav-menu-section
                                                section-id={ `${ i }, -1` }
                                                show-back-button={ true }
                                                is-submenu={ true }
                                                title={ t(ele.title) }
                                                titleUrl={ ele.url }
                                                ariaHidden={ true }
                                            >
                                                {
                                                    ele.menuSections[0]?.menuItems.map((item) => {
                                                        if (!item.megaPanelViewAll && hasLinkPermission(item)) {
                                                            return (
                                                                <dds-left-nav-menu-item
                                                                    key={ item.title }
                                                                    title={ t(item.title) }
                                                                    onClick={ (e) => {
                                                                        e.preventDefault()
                                                                        openService(item)
                                                                        onClickSideNavExpand()
                                                                    } }
                                                                >
                                                                </dds-left-nav-menu-item>
                                                            )
                                                        }
                                                        return null
                                                    })
                                                }
                                            </dds-left-nav-menu-section>
                                        </Fragment>
                                    )

                                })
                            }
                        </dds-left-nav>
                    </>
                ) : (
                    <>
                        <div ref={ wideMenuButtonRef }>{ children }</div>
                        <div className="header-wide-menu-body" expanded={ `${ expanded }` }>
                            <div ref={ wideMenuRef } className="mega-menu">
                                <div className="bmegamenu-container">
                                    <div className="megamenu-container-row">
                                        <div className="left-navigation">
                                            <div className="categories">
                                                <div className="tabs">
                                                    {
                                                        jsonData.mastheadNav.links.map((ele) => {
                                                            if (ele.menuSections.length) {
                                                                const isActive = activeTitle === ele.title;
                                                                return (
                                                                    <Fragment key={ ele.title }>
                                                                        <div
                                                                            className={ `tab ${ isActive ? 'active' : '' }` }
                                                                            key={ ele.title }
                                                                            onClick={ () => handleClickTab(ele.title) }
                                                                        >
                                                                            <button>
                                                                                { t(ele.title) }
                                                                            </button>
                                                                        </div>
                                                                    </Fragment>
                                                                )
                                                            }
                                                            return null
                                                        })
                                                    }
                                                </div>
                                            </div>

                                            {
                                                viewAllArray?.length > 0 &&
                                                <>
                                                    <div className="view-all">
                                                        <a className="bx--link"
                                                           href={ viewAllArray[0]?.url }>
                                                            <span>{ viewAllArray[0]?.title }</span>
                                                            <div className="bx--link__icon">
                                                                <ArrowRight />
                                                            </div>
                                                        </a>
                                                    </div>
                                                </>
                                            }

                                        </div>

                                        <div className="right-navigation">
                                            <div className="tabpanel">
                                                {
                                                    jsonData.mastheadNav.links.map((ele) => {
                                                        if (ele.menuSections.length && ele.title === activeTitle) {
                                                            return (
                                                                <Fragment key={ ele.title }>
                                                                    <div className="panel-heading">
                                                                        {
                                                                            ele.url !== '' ? (
                                                                                <h2>
                                                                                    <a href={ ele.url }
                                                                                       rel="noreferrer"
                                                                                       target="_blank">
                                                                                        { ele.title }
                                                                                        <ArrowRight
                                                                                            size={ 20 } />
                                                                                    </a>
                                                                                </h2>
                                                                            ) : (
                                                                                <h2>{ t(ele.title) }</h2>
                                                                            )
                                                                        }
                                                                        <span>{ ele.description }</span>
                                                                    </div>
                                                                    <div className="link-group">
                                                                        {
                                                                            ele.menuSections[0]?.menuItems.map((item) => {
                                                                                if (!item.megaPanelViewAll && hasLinkPermission(item)) {
                                                                                    return (
                                                                                        <div
                                                                                            key={ item.title }
                                                                                            className="link">
                                                                                            <a
                                                                                                onClick={ () => {
                                                                                                    openService(item)
                                                                                                    onClickSideNavExpand()
                                                                                                } }
                                                                                            >
                                                                                                <div>
                                                                                                    <span>{ t(item.title) }</span>
                                                                                                </div>
                                                                                                <span>{ t(item.megapanelContent?.description) }</span>
                                                                                            </a>
                                                                                        </div>
                                                                                    )
                                                                                }
                                                                                return null
                                                                            })
                                                                        }
                                                                    </div>
                                                                </Fragment>
                                                            )
                                                        }
                                                        return null
                                                    })
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                        <div className={ `header-wide-menu-overlay ${ expanded ? 'active' : '' }` }>
                        </div>
                    </>
                )
            }
        </>
    );

};

