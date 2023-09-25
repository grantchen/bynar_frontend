import React, {useRef, useContext} from "react";
import {Button, TabList, Tabs, Tab} from "@carbon/react";
import "./HeaderTab.scss";
import {TabContext, useMobile} from "../../sdk";
import {useTranslation} from "react-i18next";

const HeaderTab = () => {
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

    if (isMobile) {
        return null;
    }

    return (
        <>
            <div className="tab">
                <div className="tab-buttons-list" ref={carouselRef}>
                    <div style={{display: "flex", whiteSpace: "nowrap"}}>
                        <Tabs selectedIndex={activeTab} onChange={handleTabChange} dismissable onTabCloseRequest={removeTab}>
                            <TabList aria-label="List of tabs">
                                {tab.map((item, index) =>
                                    <Tab key={index} className={item.isDelted ? 'custom-tab' : 'custom-tab tab-stable'}>
                                        {item.label}
                                    </Tab>)}
                            </TabList>
                        </Tabs>

                        <Button
                            kind="ghost"
                            className="add-new-tab"
                            onClick={handleAddTab}
                        >
                            {t("add-new-tab")}
                        </Button>
                    </div>
                </div>

            </div>
        </>
    );
};
export default HeaderTab;
