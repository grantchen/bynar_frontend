import React, { useState, useRef, useEffect, useContext } from "react";
import { Close, ChevronLeft, ChevronRight } from "@carbon/react/icons";
import { Button, IconButton, Tab } from "@carbon/react";
import "./HeaderTab.scss";
import { TabContext } from "../../sdk";
import { useTranslation } from "react-i18next";


const SHOW_SCROLL_BUTTON_WIDTH = 405
const HeaderTab = () => {
  const {
    tab,
    handleAddTab,
    handleRemoveTab,
    activeTab,
    setActiveTab,
  } = useContext(TabContext);
  const carouselRef = useRef(null);
  const tabRef = useRef(null);
  const { t } = useTranslation();
  const handleLeftScroll = () => {
    if(!carouselRef.current){
      return
    }
    console.log('test1')
    carouselRef.current.scrollTo({
      left: carouselRef.current.scrollLeft - 102,
      behavior: "smooth",
    })
  };

  const handleRightScroll = () => {
    if(!carouselRef.current){
      return
    }
    console.log('test2')
    carouselRef.current.scrollTo({
      left: carouselRef.current.scrollLeft + 102,
      behavior: "smooth",
    })
  };

  const removeTab = (idToRemove, index) => {
    handleRemoveTab(idToRemove, index);
  };

  
  const shouldShowTabScroll = ((window.innerWidth - SHOW_SCROLL_BUTTON_WIDTH) / 100) < tab.length
  return (
    <>
      <div className="tab" ref={tabRef}>
        {shouldShowTabScroll && (
          <IconButton className="left-arrow" onClick={handleLeftScroll}>
            <ChevronLeft/>
          </IconButton>
        )}

        <div style={{ overflowX: "auto" }} ref={carouselRef}>
          <div style={{ display: "flex", whiteSpace: "nowrap" }}>
            {tab.map((item, index) => {
              return (
                <Button
                  kind="ghost"
                  key={index}
                  onClick={() => {
                    setActiveTab(item?.id);
                  }}
                  className={`custom-tab ${
                    activeTab === item?.id ? "active" : ""
                  }`}
                >
                  {item.label}
                  {item.isDelted && (
                    <Close
                      size={20}
                      style={{ cursor: "pointer" }}
                      onClick={() => removeTab(item.id, index)}
                    />
                  )}
                </Button>
              );
            })}
            <Button
              kind="ghost"
              className="custom-tab"
              onClick={() => {
                handleAddTab();
                setTimeout(() => {
                  carouselRef.current.scrollTo({
                    left: carouselRef.current.scrollLeft + 200,
                    behavior: "smooth",
                  })
                }, 50);
              }}
            >
              <p>{t("add-new-tab")}</p>
            </Button>
          </div>
        </div>
        {shouldShowTabScroll ? (
          <IconButton className="left-arrow" onClick={handleRightScroll}>
            <ChevronRight/>
          </IconButton>
        ) : null}
      </div>
    </>
  );
};
export default HeaderTab;
