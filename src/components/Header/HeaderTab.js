import React, { useState, useRef, useEffect, useContext } from "react";
import { Close, ChevronLeft, ChevronRight } from "@carbon/react/icons";
import { Button, IconButton, Tab } from "@carbon/react";
import "./HeaderTab.scss";
import { TabContext, useMobile, useUserManagement } from "../../sdk";
import { useTranslation } from "react-i18next";
import { useMemo } from "react";

const SHOW_SCROLL_BUTTON_WIDTH = 405;
const HeaderTab = () => {
    const { tab, handleAddTab, handleRemoveTab, activeTab, setActiveTab } =
        useContext(TabContext);
    const carouselRef = useRef(null);
    const tabRef = useRef(null);
    const { t } = useTranslation();
    const { isUserManagementAllowed } = useUserManagement();
    const isMobile = useMobile();
    const handleLeftScroll = () => {
        if (!carouselRef.current) {
            return;
        }
        carouselRef.current.scrollTo({
            left: carouselRef.current.scrollLeft - 102,
            behavior: "smooth",
        });
    };

    const handleRightScroll = () => {
        if (!carouselRef.current) {
            return;
        }
        carouselRef.current.scrollTo({
            left: carouselRef.current.scrollLeft + 102,
            behavior: "smooth",
        });
    };

    const removeTab = (idToRemove, index) => {
        handleRemoveTab(idToRemove, index);
    };

    const totalCarbonButtonsOnHeader = useMemo(() => {
        /**
         * buttons - hamburger + user list + search + user profile dropdown
         * this is hacky, if you're not sure what are you doing here. Ask Ritik first
         */
        if (isUserManagementAllowed) {
            return 5;
        }
        return 3;
    }, [isUserManagementAllowed]);

    if (isMobile) {
        return null;
    }

    const shouldShowTabScroll =
        (window.innerWidth - SHOW_SCROLL_BUTTON_WIDTH) / 100 < tab.length;
    return (
        <>
            <div
                className="tab"
                ref={tabRef}
                style={{
                    width: `calc(100vw -  ${
                        totalCarbonButtonsOnHeader * 3
                    }rem - /*text width Bynar[Platform]*/ 108px)`,
                }}
            >
                {shouldShowTabScroll && (
                    <IconButton
                        className="left-arrow"
                        onClick={handleLeftScroll}
                    >
                        <ChevronLeft />
                    </IconButton>
                )}

                <div className="tab-buttons-list" ref={carouselRef}>
                    <div style={{ display: "flex", whiteSpace: "nowrap" }}>
                        {tab.map((item, index) => {
                            return (
                                <Button
                                    kind="ghost"
                                    key={index}
                                    onClick={() => {
                                        setActiveTab(index);
                                    }}
                                    className={`custom-tab ${
                                        activeTab === index ? "active" : ""
                                    } ${index === 0 ? 'dashboard-btn' : ''}`}
                                >
                                    {item.label}
                                    {item.isDelted && (
                                        <IconButton
                                            className="close-button"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                removeTab(item.id, index);
                                            }}
                                            kind="ghost"
                                            style={{
                                                padding: 4,
                                                minHeight: 8,
                                                marginLeft: 0
                                            }}
                                        >
                                            <Close />
                                        </IconButton>
                                    )}
                                </Button>
                            );
                        })}
                        <Button
                            kind="ghost"
                            className="add-new-tab"
                            onClick={() => {
                                handleAddTab();
                                setTimeout(() => {
                                    carouselRef.current.scrollTo({
                                        left:
                                            carouselRef.current.scrollLeft +
                                            200,
                                        behavior: "smooth",
                                    });
                                }, 50);
                            }}
                        >
                            {t("add-new-tab")}
                        </Button>
                    </div>
                </div>
                {shouldShowTabScroll ? (
                    <IconButton
                        className="left-arrow"
                        onClick={handleRightScroll}
                    >
                        <ChevronRight />
                    </IconButton>
                ) : null}
            </div>
        </>
    );
};
export default HeaderTab;
