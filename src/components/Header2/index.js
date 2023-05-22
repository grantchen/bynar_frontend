import {
    ExpandableSearch,
} from "carbon-components-react";

import {
    HeaderContainer,
    Header,
    HeaderMenuButton,
    HeaderName,
    HeaderGlobalBar,
    HeaderGlobalAction,
    SkipToContent,
    Popover,
    PopoverContent,
} from "@carbon/react";

import { UserData20 } from "@carbon/icons-react";
import {
    LanguageChangeModal,
    useAuth,
    useMobile,
    useThemePreference,
    useUserManagement,
} from "../../sdk";
import { useTranslation } from "react-i18next";
import { UserProfileImage } from "@carbon/ibm-products";
import { useState } from "react";
import HeaderTab from "../../components/Header/HeaderTab";
import { Outlet, useSearchParams } from "react-router-dom";
import { useMemo } from "react";
import "./header.scss";
import { TearSheets } from "../TearSheet";
import { useRef } from "react";
import { useEffect } from "react";
import ProfileDropdown from "../ProfileDropdown";
import { AppSideNav } from "./AppSideNav";

export default function AuthenticatedAppHeader() {
    const { user } = useAuth();
    const { t } = useTranslation();
    const { theme } = useThemePreference();
    const { isUserManagementAllowed } = useUserManagement();
    const [searchParams, setSearchParams] = useSearchParams();
    const isMobile = useMobile()
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
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

    const wrapperRef = useRef(null);
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                wrapperRef.current &&
                !wrapperRef.current.contains(event.target)
            ) {
                setIsProfileDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);
    return (
        <>
            <div className="main-header-container">
                <HeaderContainer
                    render={({ isSideNavExpanded, onClickSideNavExpand }) => (
                        <Header aria-label="Bynar">
                            <SkipToContent />
                            <HeaderMenuButton
                                aria-label="Open menu"
                                onClick={onClickSideNavExpand}
                                isActive={isSideNavExpanded}
                            />
                            <HeaderName href="#" prefix="Bynar">
                                [Platform]
                            </HeaderName>
                            <HeaderGlobalBar>
                                <HeaderTab />
                                {isUserManagementAllowed && (
                                    <HeaderGlobalAction
                                        aria-label={t("user")}
                                        onClick={() => setIsUserListOpen(true)}
                                        style={{marginRight: isMobile ? '0' : '3rem'}}
                                    >
                                        <UserData20 />
                                    </HeaderGlobalAction>
                                )}
                                {
                                    !isMobile && <ExpandableSearch className="search-container" />
                                }
                                <Popover
                                    open={isProfileDropdownOpen}
                                    isTabTip
                                    align="bottom-right"
                                >
                                    <HeaderGlobalAction
                                        aria-label={user?.fullName ?? t("user")}
                                        onClick={() =>
                                            setIsProfileDropdownOpen(true)
                                        }
                                    >
                                        <UserProfileImage
                                            backgroundColor={"light-cyan"}
                                            size={"md"}
                                            initials={user?.fullName ?? "..."}
                                            theme={
                                                theme === "g90"
                                                    ? "dark"
                                                    : "light"
                                            }
                                        />
                                    </HeaderGlobalAction>
                                    <PopoverContent
                                        ref={wrapperRef}>
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
                            </HeaderGlobalBar>
                            <AppSideNav isSideNavExpanded={isSideNavExpanded} onClickSideNavExpand={onClickSideNavExpand}/>
                        </Header>
                    )}
                />
                <TearSheets
                    setIsOpen={setIsUserListOpen}
                    isOpen={isUserListOpen}
                />
            </div>
            
            <Outlet />
            <LanguageChangeModal
                isLanguageChangeModalOpen={isLanguageChangeModalOpen}
                openLanguageChangeModal={openLanguageChangeModal}
            />
        </>
    );
}