import React, { useState, useEffect, useRef } from 'react';
import jsonData from '../JSONs/usen.json';
import { ArrowRight } from "@carbon/react/icons";

import { useMobile } from "../../sdk";
import '@carbon/ibmdotcom-web-components/es/components/masthead/left-nav.js';
import '@carbon/ibmdotcom-web-components/es/components/masthead/left-nav-menu.js';
import '@carbon/ibmdotcom-web-components/es/components/masthead/left-nav-menu-item.js';
import '@carbon/ibmdotcom-web-components/es/components/masthead/left-nav-overlay.js';
import "./CustomSideNav.scss";

export function CustomSideNavMenu({ expanded }) {
    const [activeTitle, setActiveTitle] = useState(jsonData.mastheadNav.links[0]?.title);
    const handleClick = (title) => {
        setActiveTitle(title);
    };
    const [viewAllArray, setViewAllArray] = useState([])
    const leftNavRef = useRef(null)

    const isMobile = useMobile();

    useEffect(() => {
        if (!leftNavRef.current) {
            return
        }

        if (expanded) {
            leftNavRef.current.setAttribute("expanded", true);
        } else {
            leftNavRef.current.removeAttribute("expanded");
        }
    }, [expanded]);

    useEffect(() => {
        const filteredItems = jsonData.mastheadNav.links.flatMap((ele) => {
            if (ele.menuSections.length && ele.title === activeTitle) {
                return ele.menuSections[0]?.menuItems.filter((item) => item.megaPanelViewAll);
            }
            return [];
        });
        setViewAllArray(filteredItems);
    }, [activeTitle]);

    return (
        <>
            {
                isMobile ? (
                    <>
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
                                            <>
                                                <dds-left-nav-menu
                                                    title={ ele.title }
                                                    panel-id={ `${ i }, -1` }
                                                ></dds-left-nav-menu>
                                            </>
                                        )
                                    })
                                }
                            </dds-left-nav-menu-section>

                            {
                                // sub menus section
                                jsonData.mastheadNav.links.map((ele, i) => {
                                    return (
                                        <>
                                            <dds-left-nav-menu-section
                                                section-id={ `${ i }, -1` }
                                                show-back-button={ true }
                                                is-submenu={ true }
                                                title={ ele.title }
                                                titleUrl={ ele.url }
                                                ariaHidden={ true }
                                            >
                                                {
                                                    ele.menuSections[0]?.menuItems.map((item) => {
                                                        if (!item.megaPanelViewAll) {
                                                            return (
                                                                <dds-left-nav-menu-item
                                                                    href={ item.url }
                                                                    title={ item.title }
                                                                ></dds-left-nav-menu-item>
                                                            )
                                                        }
                                                    })
                                                }
                                            </dds-left-nav-menu-section>
                                        </>
                                    )

                                })
                            }
                        </dds-left-nav>
                    </>
                ) : (
                    <>
                        <div className={ `menu-body ${ expanded ? 'wide-menu-expanded' : '' }` }>
                            <div className="mega-menu">
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
                                                                    <>
                                                                        <div
                                                                            className={ `tab ${ isActive ? 'active' : '' }` }
                                                                            key={ ele.title }
                                                                            onClick={ () => handleClick(ele.title) }
                                                                        >
                                                                            <button>
                                                                                { ele.title }
                                                                            </button>
                                                                        </div>
                                                                    </>
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
                                                                <>
                                                                    <div className="panel-heading">
                                                                        {
                                                                            ele.url !== '' ? (
                                                                                <h2>
                                                                                    <a href={ ele.url }
                                                                                       target="_blank">
                                                                                        { ele.title }
                                                                                        <ArrowRight
                                                                                            size={ 20 } />
                                                                                    </a>
                                                                                </h2>
                                                                            ) : (
                                                                                <h2>{ ele.title } </h2>
                                                                            )
                                                                        }
                                                                        <span>{ ele.description }</span>
                                                                    </div>
                                                                    <div className="link-group">
                                                                        {
                                                                            ele.menuSections[0]?.menuItems.map((item) => {
                                                                                if (!item.megaPanelViewAll) {
                                                                                    return (
                                                                                        <div
                                                                                            key={ item.title }
                                                                                            className="link">
                                                                                            <a href={ item.url }
                                                                                               target="_blank"
                                                                                               rel="noopener noreferrer">
                                                                                                <div>
                                                                                                    <span>{ item.title }</span>
                                                                                                    <slot
                                                                                                        name="icon"></slot>
                                                                                                </div>
                                                                                                <span>{ item.megapanelContent?.description }</span>
                                                                                            </a>
                                                                                        </div>
                                                                                    )
                                                                                }
                                                                            })
                                                                        }
                                                                    </div>
                                                                </>
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
                        <div className={ `menu-overlay ${ expanded ? 'active' : '' }` }>
                        </div>
                    </>
                )
            }
        </>
    );

};

