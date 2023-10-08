import React, { useRef, useContext } from "react";
import {Button, TabList, Tabs, Tab, TabsSkeleton} from "@carbon/react";
import { Add20 } from '@carbon/icons-react';
import "./HeaderTab.scss";
import { TabContext } from "../../sdk";
import TabSkeleton from "carbon-web-components/es/components-react/tabs/tab-skeleton";

const HeaderTab = ({ className }) => {
    const { tab, handleAddTab, handleRemoveTab, activeTab, setActiveTab } =
        useContext(TabContext);
    const carouselRef = useRef(null);

    const handleTabChange = (evt) => {
        setActiveTab(evt.selectedIndex);
    };

    const removeTab = (index) => {
        handleRemoveTab(tab[index].id, index);
    };

    return (
        <>
            <div className={ `tab ${ className }` }>
                <div className="tab-buttons-list" ref={ carouselRef }>
                    <div style={ { display: "flex", whiteSpace: "nowrap", height: "100%" } }>
                        <Tabs selectedIndex={ activeTab } onChange={ handleTabChange } dismissable
                              onTabCloseRequest={ removeTab }>
                            <TabList aria-label="List of tabs">
                                { tab.map((item, index) =>
                                        <Tab key={ index }
                                             className={ item.isDelted ? 'custom-tab' : 'custom-tab tab-stable' }>
                                            {
                                                activeTab === index ? (item.label) : (<TabSkeleton></TabSkeleton>)
                                            }
                                        </Tab>
                                ) }
                            </TabList>
                            {/*<TabsSkeleton className={'test2'} contained={false}>2233</TabsSkeleton>*/}

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
