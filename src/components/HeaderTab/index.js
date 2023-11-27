import React, { useContext } from "react";
import {
    TabList,
    Tabs,
    Tab,
} from "@carbon/react";
import { Home } from "@carbon/react/icons";
import "./HeaderTab.scss";
import { TabContext } from "../../sdk";
import TabSkeleton from "carbon-web-components/es/components-react/tabs/tab-skeleton";
import DropdownServiceList from "./DropdownServiceList";

// TabIcon is the tab icon component
const TabIcon = (tabItem) => {
    return (
        <>
            {
                tabItem.canDelete ? (
                    <>
                        {/* use native dismissable because of Chevron scroll misbehave */}
                    </>
                ) : (
                    tabItem.name === "Dashboard" &&
                    <>
                        <Home size={16} />
                    </>
                )
            }
        </>
    )
}

// HeaderTab is the header tab component
const HeaderTab = ({ className }) => {
    const { tab, handleRemoveTab, activeTab, setActiveTab } =
        useContext(TabContext);

    // set active tab when tab changes
    const handleTabChange = (evt) => {
        if (tab[evt.selectedIndex]?.loaded === true) {
            setActiveTab(evt.selectedIndex);
            // config hidden or display
            const elem = document.querySelector("#ccs-20-tabpanel-" + evt.selectedIndex + " .tree-grid-content .tree-grid-wrapper div")
            let gridDisabled = document.getElementsByClassName('GridDisabled')
            let menuMain = document.getElementsByClassName('TSMenuMain')
            if (localStorage.getItem(elem.id) === "true") {
                for (let i = 0; i < gridDisabled.length; i++) {
                    gridDisabled[i].style.zIndex = "256";
                }
                for (let i = 0; i < menuMain.length; i++) {
                    menuMain[i].style.display = "block";
                }
            } else {
                for (let i = 0; i < gridDisabled.length; i++) {
                    gridDisabled[i].style.zIndex = "-99";
                }
                for (let i = 0; i < menuMain.length; i++) {
                    menuMain[i].style.display = "none";
                }
            }
        }
    };

    // remove tab when close button is clicked
    const removeTab = (tabId) => {
        handleRemoveTab(tabId);
    };

    return (
        <>
            <div className={`header-dynamic-tab ${className ? className : ''}`}>
                <div className="tab-buttons-list">
                    <div style={{ display: "flex", whiteSpace: "nowrap", height: "100%" }}>
                        <Tabs selectedIndex={activeTab}
                            onChange={handleTabChange}
                            dismissable
                            onTabCloseRequest={(index) => {
                                removeTab(tab[index].id)
                            }}
                        >
                            <TabList aria-label="List of tabs">
                                {tab.map((item, index) =>
                                    <Tab key={`${item.id}-${index}`}
                                        renderIcon={() => {
                                            return TabIcon(item)
                                        }}
                                        className={`custom-tab ${!item.canDelete ? 'tab-stable' : ''} ${item.name === 'Dashboard' ? 'tab-icon-reverse' : ''}`}>
                                        {
                                            item.loaded ? (item.label) : (<div className={"tab-skeleton"}><TabSkeleton></TabSkeleton></div>)
                                        }
                                    </Tab>
                                )}
                            </TabList>
                        </Tabs>
                    </div>
                </div>

                <DropdownServiceList></DropdownServiceList>
            </div>
        </>
    );
};
export default HeaderTab;
