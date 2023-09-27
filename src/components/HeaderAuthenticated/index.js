import { ExpandableSearch } from "carbon-components-react";
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
    CardManagementProvider,
    InvoicesProvider,
    LanguageChangeModal,
    omitQueryParams,
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
import UploadProfileImageModal from "../../sdk/uploadprofileimage";

import { Switcher } from "@carbon/react/icons";
import ibmLogo from '../media/IBM_logo_black.svg'
import { CustomSideNavMenu } from "./CustomSideNavMenu";

function _AuthenticatedAppHeader() {
    const { user } = useAuth();
    const { t } = useTranslation();
    const { theme } = useThemePreference();
    const { isUserManagementAllowed } = useUserManagement();
    const [searchParams, setSearchParams] = useSearchParams();
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const [isLanguageChangeModalOpen, openLanguageChangeModal] =
        useState(false);
    const [isUploadProfileImageModalOpen, openUploadProfileImageModal] =
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

    const [expandSearchBar, setExpandSearchBar] = useState(false)

    const handleSearchClear = () => {
        setExpandSearchBar(data => !data)
    }

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
                    render={ ({ isSideNavExpanded, onClickSideNavExpand }) => (
                        <Header aria-label="Bynar">
                            <SkipToContent />
                            <CustomSideNavMenu expanded={ isSideNavExpanded } />
                            <HeaderGlobalAction
                                aria-label={
                                    isSideNavExpanded ? 'Close' : 'Open'
                                }
                                aria-expanded={ isSideNavExpanded }
                                isActive={ isSideNavExpanded }
                                onClick={ (e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    onClickSideNavExpand()
                                } }
                                tooltipAlignment="end"
                                id="switcher-button">
                                <Switcher size="25" style={ { color: "cornflowerblue" } } />
                            </HeaderGlobalAction>

                            <HeaderName href="/" prefix="">
                                <img src={ ibmLogo } alt="ibm_logo" />
                            </HeaderName>

                            <HeaderName className="seperatorHead" prefix="">
                                <div className="logoSeperator" />
                            </HeaderName>

                            <HeaderName className="orgName" prefix="">
                                Bynar
                            </HeaderName>

                            {/* <HeaderName href="#" prefix="Bynar">
                                [Platform]
                            </HeaderName> */ }

                            <HeaderGlobalBar>
                                <HeaderTab />
                                <ExpandableSearch
                                    className="search-container"
                                    labelText="Enter search term"
                                    isExpanded={ expandSearchBar }
                                    placeholder="Search all of Bynar"
                                    onClear={ handleSearchClear }
                                />
                            </HeaderGlobalBar>

                            { isUserManagementAllowed && (
                                <HeaderGlobalAction
                                    aria-label={ t("user") }
                                    className="user-list-nav-button"
                                    onClick={ () => setIsUserListOpen(true) }
                                >
                                    <UserData20 />
                                </HeaderGlobalAction>
                            ) }

                            <Popover
                                open={ isProfileDropdownOpen }
                                isTabTip
                                align="bottom-right"
                                className="popover-dropdown"
                            >
                                <HeaderGlobalAction
                                    aria-label={ user?.fullName ?? t("user") }
                                    onClick={ () => {
                                        setIsProfileDropdownOpen(true);
                                        setSearchParams((prev) =>
                                            omitQueryParams(prev, [
                                                "userIdToShowDetails",
                                                "openAddUserPanel",
                                                "userIdToBeEdited",
                                                "openCardMangementPanel",
                                                "isInvoiceListOpen"
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
                                <PopoverContent ref={ wrapperRef }>
                                    <ProfileDropdown
                                        onProfileOptionClick={ () => {
                                            setSearchParams({
                                                userIdToShowDetails:
                                                user?.id,
                                            });
                                            setIsProfileDropdownOpen(false);
                                        } }
                                        openLanguageModal={
                                            isLanguageChangeModalOpen
                                        }
                                        setLanguageModalOpen={
                                            openLanguageChangeModal
                                        }
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
                    ) }
                />
                <TearSheets
                    setIsOpen={ setIsUserListOpen }
                    isOpen={ isUserListOpen }
                />
            </div>

            <Outlet />
            <LanguageChangeModal
                isLanguageChangeModalOpen={ isLanguageChangeModalOpen }
                openLanguageChangeModal={ openLanguageChangeModal }
            />
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
            <InvoicesProvider>
                <_AuthenticatedAppHeader { ...props } />
            </InvoicesProvider>
        </CardManagementProvider>
    );
}
