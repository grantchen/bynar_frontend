import React, {useState, useRef, useEffect, useContext} from "react";
import { Close, ChevronLeft, ChevronRight } from "@carbon/react/icons";
import { Button, IconButton } from "@carbon/react";
import "./HeaderTab.scss";
import { TabContext, useMobile } from "../../sdk";
import { useTranslation } from "react-i18next";

const HeaderTab = () => {
    const { tab, handleAddTab, handleRemoveTab, activeTab, setActiveTab } =
        useContext(TabContext);
    const carouselRef = useRef(null);
    const tabRef = useRef(null);
    const { t } = useTranslation();
    const isMobile = useMobile();
    const [shouldShowTabScroll, setShouldShowTabScroll] = useState(false)

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

    const calcShouldShowTabScroll = () => {
        if (carouselRef.current && tabRef.current) {
            setShouldShowTabScroll(carouselRef.current.scrollWidth > tabRef.current.clientWidth)
        }
        return false;
    }

    const removeTab = (idToRemove, index) => {
        handleRemoveTab(idToRemove, index);
    };

    useEffect(() => {
        window.addEventListener('resize', calcShouldShowTabScroll)
        calcShouldShowTabScroll()
        return () => window.removeEventListener('resize', calcShouldShowTabScroll)
    }, [tab.length])

    if (isMobile) {
        return null;
    }

    return (
        <>
            <div
                className="tab"
                ref={tabRef}
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
                                        <div
                                            className="close-button"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                removeTab(item.id, index);
                                            }}
                                        >
                                            <Close />
                                        </div>
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
                                    carouselRef.current?.scrollTo({
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
                        className="right-arrow"
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
