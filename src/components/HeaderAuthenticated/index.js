import {
    HeaderContainer,
    Header,
    HeaderName,
    HeaderGlobalBar,
    HeaderGlobalAction,
    SkipToContent,
    Popover,
    PopoverContent, HeaderMenuButton,
} from "@carbon/react";
import {
    CardManagementProvider,
    omitQueryParams,
    useAuth,
    useThemePreference,
} from "../../sdk";
import { useTranslation } from "react-i18next";
import { UserProfileImage } from "@carbon/ibm-products";
import { useState } from "react";
import HeaderTab from "../../components/Header/HeaderTab";
import { Outlet, useSearchParams } from "react-router-dom";
import "./header.scss";
import { useRef } from "react";
import { useEffect } from "react";
import ProfileDropdown from "../ProfileDropdown";
import UploadProfileImageModal from "../../sdk/uploadprofileimage";

import ibmLogo from '../media/IBM_logo_black.svg'
import ibmWhiteLogo from '../media/IBM_logo_white.svg'
import { CustomWideMenu } from "./CustomWideMenu";
import MastheadSearch from "@carbon/ibmdotcom-react/lib/components/Masthead/MastheadSearch";

function _AuthenticatedAppHeader({ isSideNavExpanded, onClickSideNavExpand }) {
    const { user } = useAuth();
    const { t } = useTranslation();
    const { theme } = useThemePreference();
    const [searchParams, setSearchParams] = useSearchParams();
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const [isUploadProfileImageModalOpen, openUploadProfileImageModal] =
        useState(false);

    const wrapperRef = useRef(null);
    const [isSearchBarExpanded, setIsSearchBarExpanded] = useState(false)

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
            <Header aria-label="Bynar">
                <SkipToContent />
                <CustomWideMenu expanded={ isSideNavExpanded }
                                onClickSideNavExpand={ onClickSideNavExpand }>
                    <HeaderGlobalAction
                        className={ isSearchBarExpanded ? 'has-search-active' : '' }
                        aria-label={
                            isSideNavExpanded ? 'Close' : 'Open'
                        }
                        aria-expanded={ isSideNavExpanded }
                        onClick={ (e) => {
                            e.stopPropagation()
                            onClickSideNavExpand()
                        } }
                        tooltipAlignment="end"
                        id="switcher-button">
                        <HeaderMenuButton
                            isActive={ isSideNavExpanded }
                        />
                    </HeaderGlobalAction>
                </CustomWideMenu>

                <HeaderName
                    href="/"
                    prefix=""
                    className={ isSearchBarExpanded ? 'has-search-active' : '' }
                >
                    <img src={ document.documentElement.getAttribute(
                        "data-carbon-theme") !== null &&
                    document.documentElement.getAttribute(
                        "data-carbon-theme") !== 'white' ? ibmWhiteLogo : ibmLogo } alt="ibm_logo" />
                </HeaderName>

                <HeaderName
                    className={ `seperatorHead ${ isSearchBarExpanded ? 'has-search-active' : '' }` }
                    prefix=""
                >
                    <div className="logoSeperator" />
                </HeaderName>

                <HeaderName
                    className={ `orgName ${ isSearchBarExpanded ? 'has-search-active' : '' }` }
                    prefix=""
                >
                    Bynar
                </HeaderName>

                <HeaderGlobalBar>
                    <HeaderTab className={ isSearchBarExpanded ? 'has-search-active' : '' } />
                    <MastheadSearch
                        placeHolderText="Search all of Bynar"
                        isSearchActive={ isSearchBarExpanded }
                        onChangeSearchActive={ (event, { isOpen }) => {
                            setIsSearchBarExpanded(isOpen)
                        } }></MastheadSearch>
                </HeaderGlobalBar>

                <Popover
                    ref={ wrapperRef }
                    open={ isProfileDropdownOpen }
                    isTabTip
                    align="bottom-right"
                    className={ `popover-dropdown ${ isSearchBarExpanded ? 'has-search-active' : '' }` }
                >
                    <HeaderGlobalAction
                        aria-label={ user?.fullName ?? t("user") }
                        onClick={ () => {
                            setIsProfileDropdownOpen(!isProfileDropdownOpen);
                            setSearchParams((prev) =>
                                omitQueryParams(prev, [
                                    "userIdToShowDetails",
                                    "openAddUserPanel",
                                    "userIdToBeEdited",
                                    "openCardMangementPanel",
                                ])
                            );
                        } }
                    >
                        <UserProfileImage
                            backgroundColor={ "light-cyan" }
                            size={ "md" }
                            initials={ user?.fullName ?? "..." }
                            image={ user?.profileURL ?? "" }
                            theme={
                                theme === "g90"
                                    ? "dark"
                                    : "light"
                            }
                        />
                    </HeaderGlobalAction>
                    <PopoverContent>
                        <ProfileDropdown
                            onProfileOptionClick={ () => {
                                setSearchParams({
                                    userIdToShowDetails:
                                    user?.id,
                                });
                                setIsProfileDropdownOpen(false);
                            } }
                            openUploadProfileModal={
                                isUploadProfileImageModalOpen
                            }
                            setUploadProfileModalOpen={
                                openUploadProfileImageModal
                            }
                        />
                    </PopoverContent>
                </Popover>
            </Header>

            <UploadProfileImageModal
                isUploadProfileImageModalOpen={ isUploadProfileImageModalOpen }
                openUploadProfileImageModal={ openUploadProfileImageModal }
            />
        </>
    );
}

export default function AuthenticatedAppHeader(props) {
    return (
        <CardManagementProvider>
            <div className="main-header-container">
                <HeaderContainer { ...props } render={_AuthenticatedAppHeader} />
            </div>
            <Outlet />
        </CardManagementProvider>
    );
}
