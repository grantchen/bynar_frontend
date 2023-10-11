import { useContext } from "react";
import { TabContext, useMobile } from "../../sdk";
import {
    ExpandableSearch,
    Search,
    SideNav,
} from "carbon-components-react";
import { Fade, Close } from "@carbon/react/icons";
import {
    SideNavItems,
    SideNavLink,
    SideNavMenu,
    SideNavMenuItem, } from "@carbon/react";
import { useTranslation } from "react-i18next";
import "./AppSideNav.scss";
import { Button } from "@carbon/react";

export function AppSideNav({ isSideNavExpanded, onClickSideNavExpand }) {
    const {
        tab: tabs,
        handleAddTab,
        handleRemoveTab,
        activeTab: activeTabIndex,
        setActiveTab,
    } = useContext(TabContext);
    const { t } = useTranslation();

    const isMobile = useMobile();

    return (
        <SideNav
            aria-label="Side navigation"
            expanded={isSideNavExpanded}
            isPersistent={false}
            className="sidenav-container"
        >
            <SideNavItems>
                <SideNavMenu renderIcon={Fade} title="Category title">
                    <SideNavMenuItem href="#">Link</SideNavMenuItem>
                    <SideNavMenuItem href="#">Link</SideNavMenuItem>
                    <SideNavMenuItem href="#">Link</SideNavMenuItem>
                </SideNavMenu>
                <SideNavMenu renderIcon={Fade} title="Category title">
                    <SideNavMenuItem href="#">Link</SideNavMenuItem>
                    <SideNavMenuItem href="#">Link</SideNavMenuItem>
                    <SideNavMenuItem href="#">Link</SideNavMenuItem>
                </SideNavMenu>
                <SideNavMenu renderIcon={Fade} title="Category title">
                    <SideNavMenuItem href="#">Link</SideNavMenuItem>
                    <SideNavMenuItem href="#">Link</SideNavMenuItem>
                    <SideNavMenuItem href="#">Link</SideNavMenuItem>
                </SideNavMenu>

                {isMobile && (
                    <SideNavMenu renderIcon={Fade} title="Dynamic Tabs">
                        {tabs.map((tab, index) => (
                            <SideNavMenuItem
                                key={index}
                                className="side-nav-item-with-action"
                                aria-current={
                                    index === activeTabIndex ? "page" : "link"
                                }
                                onClick={() => {
                                    handleTabChange({selectedIndex:index});
                                    onClickSideNavExpand();
                                }}
                            >
                                {tab.label}
                                {
                                    // this is probably isDeletable not touching tab context code for now
                                    tab.isDelted && (
                                        //becasue carbon button can't stop event propagation
                                        <div
                                            role="button"
                                            onClick={(e) => {
                                                e.preventDefault()
                                                e.stopPropagation()
                                                handleRemoveTab(tab.id);
                                            }}
                                            className="delete-btn"
                                        >
                                            <Close size={12} />
                                        </div>
                                    )
                                }
                            </SideNavMenuItem>
                        ))}
                        <SideNavMenuItem onClick={handleAddTab}>
                            {t("add-new-tab")}
                        </SideNavMenuItem>
                    </SideNavMenu>
                )}
                <SideNavLink renderIcon={Fade} href="#">
                    Link
                </SideNavLink>
                <SideNavLink renderIcon={Fade} href="#">
                    Link
                </SideNavLink>
            </SideNavItems>
        </SideNav>
    );
}
