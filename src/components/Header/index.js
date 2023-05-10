import React, { useState, useEffect, useRef, useContext, useMemo } from "react";
import {
  Header,
  HeaderMenuButton,
  HeaderName,
  HeaderGlobalBar,
  HeaderGlobalAction,
  HeaderContainer,
  Popover,
  PopoverContent,
} from "@carbon/react";
import { Search20, UserAvatar20 } from "@carbon/icons-react";
import { Navbar } from "../Navbar";
import { Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ProfileDropdown from "../ProfileDropdown";
import HeaderTab from "./HeaderTab";
import {
  BaseURL,
  AuthContext,
  SAMPLE_NOTIFICATION_DATA,
  ThemeModel,
  LanguageModel,
  mergeQueryParams,
} from "../../sdk";
import { TearSheets } from "../TearSheet";
import { SidePanels } from "../SidePanel";
import { useSearchParams } from "react-router-dom";
import { RemoveModal } from "@carbon/ibm-products";

export const CommonHeader = () => {
  return (
    <div>
      <HeaderContainer render={HeaderComponent} />
    </div>
  );
};

const HeaderComponent = ({ isSideNavExpanded, onClickSideNavExpand }) => {
  const authContext = useContext(AuthContext);
  const [searchParams, setSearchParams] = useSearchParams();
  //todo for Suyash: get token from auth context
  const token = localStorage.getItem("token");
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [open, setOpen] = useState(false);
  const [notificationsData, setNotificationsData] = useState(
    SAMPLE_NOTIFICATION_DATA
  );

  const wrapperRef = useRef(null);
  const showProfilePanelRef = useRef(null);
  const setShowProfilePanelRef = useRef(null);
  showProfilePanelRef.current = profileDropdown;
  setShowProfilePanelRef.current = setProfileDropdown;
  const [showButton, setShowButton] = useState(false);
  const { t } = useTranslation();

  const handleDropDown = (e) => {
    e.preventDefault();
    setProfileDropdown((profileDropdown) => !profileDropdown);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        if (showProfilePanelRef.current) {
          setShowProfilePanelRef.current(false);
          console.log("check");
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  const getUserDetail = async () => {
    try {
      const response = await fetch(`${BaseURL}/user`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });

      if (response.ok) {
        const res = await response.json();
        if (
          res?.result.cognitoUserGroups === "Users" ||
          res?.result.cognitoUserGroups.length == 0
        ) {
          setShowButton(false);
        } else {
          setShowButton(true);
        }
      } else if (response.status === 500) {
      }
    } catch (e) {
      await authContext.signout();
    }
  };

  useEffect(() => {
    getUserDetail();
  }, []);

  const [openLanguageModel, setLanguageModelOpen] = useState(false);
  const [openThemeModel, setThemeModelOpen] = useState(false);

  const {isUserListOpen, setIsUserListOpen} = useMemo(() => ({
    isUserListOpen: searchParams.get('isUserListOpen') === 'true', 
    setIsUserListOpen: (shouldOpen) => setSearchParams({isUserListOpen: shouldOpen})
  }), [searchParams.get('isUserListOpen')])

  return (
    <>
      <div>
        <Header
          aria-label="IBM Platform Name"
          style={{ backgroundColor: "#FFFFFF" }}
        >
          <HeaderMenuButton
            aria-label="Open menu"
            isCollapsible
            onClick={onClickSideNavExpand}
            isActive={isSideNavExpanded}
          />
          <div
            className={
              isSideNavExpanded
                ? "header-container-box"
                : "header-box-dashboard"
            }
          >
            <HeaderName className="heading-content" prefix={t("")}>
              {t("Bynar")}
            </HeaderName>
            <div className="border-outline"></div>
            <HeaderName className="heading-content-new" prefix={t("")}>
              {t("platform")}
            </HeaderName>
            <HeaderTab />
            <div className="border-outline"></div>
            {/* <button style={{ cursor: 'pointer' }} onClick={handleOpenModalClick}>user</button> */}
            <HeaderGlobalBar className="header-tab">
              {showButton && (
                <HeaderGlobalAction
                  aria-label="Users"
                  onClick={() => setIsUserListOpen(true)}
                >
                  <img
                    src={"../../../images/user-list.svg"}
                    style={{ height: "20px", width: "20px" }}
                  />
                </HeaderGlobalAction>
              )}
              <HeaderGlobalAction aria-label="Search" onClick={() => { }}>
                <Search20 />
              </HeaderGlobalAction>
              {/* <HeaderGlobalAction aria-label="Notifications" onClick={() => setOpen(!open)}>
            <Notification20 />
          </HeaderGlobalAction> */}

              <div ref={wrapperRef}>
                <>
                  <Popover
                    align="bottom-right"
                    caret={false}
                    open={profileDropdown}
                  >
                    <HeaderGlobalAction
                      className="header-tab"
                      aria-label="User"
                      onClick={handleDropDown}
                    >
                      <UserAvatar20 />
                    </HeaderGlobalAction>
                    <PopoverContent>
                      <ProfileDropdown
                        openThemeModel={openThemeModel}
                        setThemeModelOpen={setThemeModelOpen}
                        openLanguageModel={openLanguageModel}
                        setLanguageModelOpen={setLanguageModelOpen}
                      />
                    </PopoverContent>
                  </Popover>
                </>
              </div>
            </HeaderGlobalBar>
          </div>
          <Navbar isSideNavExpanded={isSideNavExpanded} />
        </Header>
        <Outlet />

        <ThemeModel
          openModel={openThemeModel}
          setModelOpen={setThemeModelOpen}
        />
        <LanguageModel
          openLanguageModel={openLanguageModel}
          setLanguageModelOpen={setLanguageModelOpen}
        />
        
        
      </div>

      {isUserListOpen && <TearSheets setIsOpen={setIsUserListOpen} isOpen={true} />}
    </>
  );
};
