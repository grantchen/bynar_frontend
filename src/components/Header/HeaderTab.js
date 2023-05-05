import React, { useState, useRef, useEffect, useContext } from "react";
import { Close } from "@carbon/react/icons";
import { Button, IconButton, Tab } from "@carbon/react";
import "./HeaderTab.scss";
import { TabContext } from "../../sdk";
import { useTranslation } from "react-i18next";

const HeaderTab = () => {
  const {
    tab,
    handleAddTab,
    handleRemoveTab,
    setStartIndex,
    setEndIndex,
    startIndex,
    endIndex,
    activeTab,
    setActiveTab,
    maxTab,
    setMaxTab,
  } = useContext(TabContext);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const carouselRef = useRef(null);
  const tabRef = useRef(null);
  const { t } = useTranslation();
  const handleLeftScroll = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - 1);
      setEndIndex(endIndex - 1);
      if (tab.length > maxTab) {
        setShowRightArrow(true);
      } else {
        setShowRightArrow(false);
      }
    }
    if (startIndex === 0) {
      setShowLeftArrow(false);
    }
  };

  const handleRightScroll = () => {
    const l = tab.slice(startIndex, endIndex).length;
    if (l < maxTab) {
      setShowRightArrow(false);
      setShowLeftArrow(true);
    } else {
      setStartIndex(startIndex + 1);
      setEndIndex(endIndex + 1);
    }
  };

  const removeTab = (idToRemove, index) => {
    handleRemoveTab(idToRemove, index);
  };

  useEffect(() => {
    setShowLeftArrow(startIndex > 0 ? true : false);
    setShowRightArrow(tab.length > maxTab && maxTab > 0 ? true : false);
  }, [tab]);

  const handleWindowSizeChange = () => {
    const width = window.innerWidth - 360;
    const res = (width - 150) / 130;
    if (res < 0) {
      setMaxTab(7);
      setEndIndex(7);
    } else {
      setMaxTab(Math.floor(res));
      setEndIndex(Math.floor(res));
    }
  };

  useEffect(() => {
    handleWindowSizeChange();
  }, []);
  return (
    <>
      <div className="tab" ref={tabRef}>
        {showLeftArrow && startIndex > 0 && (
          <IconButton className="left-arrow" onClick={handleLeftScroll}>
            <img
              src={"../../../images/left-arrow.svg"}
              style={{ width: "15px", height: "15px" }}
              alt="left arrow"
            />
          </IconButton>
        )}

        <div style={{ overflowX: "hidden" }} ref={carouselRef}>
          <div style={{ display: "flex", whiteSpace: "nowrap" }}>
            {tab.slice(startIndex, endIndex).map((item, index) => {
              return (
                <Button
                  kind="ghost"
                  key={index}
                  style={{
                    color: "#525252",
                  }}
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
              style={{
                color: "#525252",
              }}
              onClick={() => {
                handleAddTab();
              }}
            >
              <p>{t("add-new-tab")}</p>
            </Button>
          </div>
        </div>
        {showRightArrow ? (
          <IconButton className="left-arrow" onClick={handleRightScroll}>
            <img
              src={"../../images/right-arrow.svg"}
              style={{ width: "12px", height: "100%" }}
              alt="right arrow"
            />
          </IconButton>
        ) : null}
      </div>
    </>
  );
};
export default HeaderTab;
