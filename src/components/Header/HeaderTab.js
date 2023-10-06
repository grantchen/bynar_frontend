import React, {useRef, useContext} from "react";
import {Button, TabList, Tabs, Tab} from "@carbon/react";
import { Add20 } from '@carbon/icons-react';
import "./HeaderTab.scss";
import {TabContext, useMobile} from "../../sdk";
import {useTranslation} from "react-i18next";

const HeaderTab = ({ className }) => {
    const {tab, handleAddTab, handleRemoveTab, activeTab, setActiveTab} =
        useContext(TabContext);
    const carouselRef = useRef(null);
    const {t} = useTranslation();
    const isMobile = useMobile();

    const handleTabChange = (evt) => {
        setActiveTab(evt.selectedIndex);
    };

    const removeTab = (index) => {
        handleRemoveTab(tab[index].id, index);
    };

    return (
        <>
            <div className={ `tab ${className}` }>
                <div className="tab-buttons-list" ref={carouselRef}>
                    <div style={{display: "flex", whiteSpace: "nowrap", height: "100%"}}>
                        <Tabs selectedIndex={activeTab} onChange={handleTabChange} dismissable onTabCloseRequest={removeTab}>
                            <TabList aria-label="List of tabs">
                                {tab.map((item, index) =>
                                    <Tab key={index} className={item.isDelted ? 'custom-tab' : 'custom-tab tab-stable'}>
                                        {item.label}
                                    </Tab>)}
                            </TabList>
                        </Tabs>
                    </div>
                </div>

                <Button
                    kind="ghost"
                    className="add-new-tab"
                    hasIconOnly
                    onClick={handleAddTab}
                >
                    <Add20 aria-label="Add" />
                </Button>
            </div>
        </>
    );
};
export default HeaderTab;
