import React, { useContext } from "react";
import {
    Button,
    TabList,
    Tabs,
    Tab,
} from "@carbon/react";
import { Add20 } from '@carbon/icons-react';
import "./HeaderTab.scss";
import { TabContext } from "../../sdk";
import { Home16 } from "@carbon/icons-react";
import TabSkeleton from "carbon-web-components/es/components-react/tabs/tab-skeleton";

const TabIcon = (tabItem) => {
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
                        {/* icon home should be a little smaller */ }
                        <Home16 width={ 13 } height={ 13 }></Home16>
                    </>
                )
            }
        </>
    )
}


const HeaderTab = ({ className }) => {
    const { tab, handleAddTab, handleRemoveTab, activeTab, setActiveTab } =
        useContext(TabContext);

    const handleTabChange = (evt) => {
        if (tab[evt.selectedIndex]?.loaded === true) {
            setActiveTab(evt.selectedIndex);
        }
    };

    const removeTab = (tabId) => {
        handleRemoveTab(tabId);
    };

    return (
        <>
            <div className={ `header-dynamic-tab ${ className ? className : '' }` }>
                <div className="tab-buttons-list">
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
                                             return TabIcon(item)
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

            </div>
        </>
    );
};
export default HeaderTab;
