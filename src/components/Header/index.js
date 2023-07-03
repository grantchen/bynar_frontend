import React, { useState, useEffect, useRef, useMemo } from "react";
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
import { UserProfileImage } from "@carbon/ibm-products";
import { Search20, UserAvatar20, UserData20 } from "@carbon/icons-react";
import { Navbar } from "../Navbar";
import { Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ProfileDropdown from "../ProfileDropdown";
import HeaderTab from "./HeaderTab";
import {
    LanguageModal,
    useUserManagement,
    useThemePreference,
    useAuth,
    LanguageChangeModal,
} from "../../sdk";
import { TearSheets } from "../TearSheet";
import { useSearchParams } from "react-router-dom";


export const CommonHeader = () => {
    return (
        <div>
            <HeaderContainer render={HeaderComponent} />
        </div>
    );
};

const HeaderComponent = ({ isSideNavExpanded, onClickSideNavExpand }) => {
    const [searchParams, setSearchParams] = useSearchParams();
    //todo for Suyash: get token from auth context

    const [profileDropdown, setProfileDropdown] = useState(false);
    const { theme } = useThemePreference();

    const { user } = useAuth();

    const wrapperRef = useRef(null);
    const showProfilePanelRef = useRef(null);
    const setShowProfilePanelRef = useRef(null);
    showProfilePanelRef.current = profileDropdown;
    setShowProfilePanelRef.current = setProfileDropdown;
    const { t } = useTranslation();

    const { isUserManagementAllowed } = useUserManagement();

    const handleDropDown = (e) => {
        e.preventDefault();
        setProfileDropdown((profileDropdown) => !profileDropdown);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                wrapperRef.current &&
                !wrapperRef.current.contains(event.target)
            ) {
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

    const [isLanguageChangeModalOpen, openLanguageChangeModal] =
        useState(false);

    const { isUserListOpen, setIsUserListOpen } = useMemo(
        () => ({
            isUserListOpen: searchParams.get("isUserListOpen") === "true",
            setIsUserListOpen: (shouldOpen) =>
                setSearchParams({ isUserListOpen: shouldOpen }),
        }),
        [searchParams.get("isUserListOpen")]
    );

    return (
        <>
            <Header aria-label="Bynar" className="header-container">
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
                    <HeaderName className="heading-content-new" prefix={t("")}>
                        {t("platform")}
                    </HeaderName>
                    <HeaderTab />
                    {/* <button style={{ cursor: 'pointer' }} onClick={handleOpenModalClick}>user</button> */}
                    <HeaderGlobalBar className="header-tab">
                        {isUserManagementAllowed && (
                            <HeaderGlobalAction
                                aria-label={t("user")}
                                onClick={() => setIsUserListOpen(true)}
                            >
                                <UserData20 />
                            </HeaderGlobalAction>
                        )}
                        <HeaderGlobalAction
                            aria-label={t("search")}
                            onClick={() => { }}
                        >
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
                                        aria-label={t("user")}
                                        onClick={handleDropDown}
                                    >
                                        <UserProfileImage
                                            backgroundColor={"light-cyan"}
                                            size={"md"}
                                            initials={user?.fullName ?? "..."}
                                            tooltipText={
                                                user?.fullName ?? "..."
                                            }
                                            theme={
                                                theme === "g90"
                                                    ? "dark"
                                                    : "light"
                                            }
                                        />
                                    </HeaderGlobalAction>
                                    <PopoverContent>
                                        <ProfileDropdown
                                            openLanguageModal={
                                                isLanguageChangeModalOpen
                                            }
                                            setLanguageModalOpen={
                                                openLanguageChangeModal
                                            }
                                        />
                                    </PopoverContent>
                                </Popover>
                            </>
                        </div>
                    </HeaderGlobalBar>
                </div>
                <Navbar
                    isSideNavExpanded={isSideNavExpanded}
                    onClickSideNavExpand={onClickSideNavExpand}
                />
            </Header>
            <Outlet />
            <LanguageChangeModal
                isLanguageChangeModalOpen={isLanguageChangeModalOpen}
                openLanguageChangeModal={openLanguageChangeModal}
            />
            <TearSheets setIsOpen={setIsUserListOpen} isOpen={isUserListOpen} />
        </>
    );
};
