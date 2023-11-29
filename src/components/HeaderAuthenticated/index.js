import {
    HeaderContainer,
    Header,
    HeaderName,
    HeaderGlobalBar,
    HeaderGlobalAction,
    SkipToContent,
    Popover,
    PopoverContent, HeaderMenuButton
} from "@carbon/react";
import {
    CardManagementProvider, omitQueryParams,
    useAuth, useMobile,
    useThemePreference,
    handleActiveTabCfg
} from "../../sdk";
import { useTranslation } from "react-i18next";
import { UserProfileImage } from "@carbon/ibm-products";
import { useState, useContext } from "react";
import HeaderTab from "../HeaderTab/index";
import { Outlet, useSearchParams } from "react-router-dom";
import "./header.scss";
import { useRef } from "react";
import { useEffect } from "react";
import ProfileDropdown from "../ProfileDropdown";
import UploadProfileImageModal from "../../sdk/uploadprofileimage";

import logoName from '../media/logoName.svg';
import logoNameDark from '../media/logoNameDark.svg';
import { CustomWideMenu } from "./CustomWideMenu";
import MastheadSearch from "@carbon/ibmdotcom-react/lib/components/Masthead/MastheadSearch";
import DropdownTabList from "../HeaderTab/DropdownTabList";
import { OrganizationAccountProvider } from "../../sdk/context/OrganizationAccountManagementContext";
import { TabContext } from "../../sdk";

// _AuthenticatedAppHeader is the header component for the authenticated app
function _AuthenticatedAppHeader({ isSideNavExpanded, onClickSideNavExpand }) {
    const { user } = useAuth();
    const { t } = useTranslation();
    const isMobile = useMobile();
    const { theme } = useThemePreference();
    const [, setSearchParams] = useSearchParams();
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const [isUploadProfileImageModalOpen, openUploadProfileImageModal] =
        useState(false);

    const { activeTab } = useContext(TabContext);

    const wrapperRef = useRef(null);
    const [isSearchBarExpanded, setIsSearchBarExpanded] = useState(false)

    // close the wide menu when clicked outside
    useEffect(() => {
        const handleClickWideMenuOutside = (event) => {
            if (
                wrapperRef.current &&
                !wrapperRef.current.contains(event.target)
            ) {
                setIsProfileDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickWideMenuOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickWideMenuOutside);
        };
    }, []);

    return (
        <>
            <Header aria-label="Bynar" className={"webapp-header"}>
                <SkipToContent />
                <CustomWideMenu expanded={isSideNavExpanded}
                    onClickSideNavExpand={onClickSideNavExpand}>
                    <HeaderMenuButton
                        className={isSearchBarExpanded ? 'has-search-active' : ''}
                        aria-label={
                            isSideNavExpanded ? 'Close' : 'Open'
                        }
                        aria-expanded={isSideNavExpanded}
                        onClick={(e) => {
                            e.stopPropagation()
                            onClickSideNavExpand()
                            if (!isSideNavExpanded) {
                                handleActiveTabCfg(0)
                            } else {
                                handleActiveTabCfg(activeTab)
                            }
                        }}
                        id="switcher-button"
                        isActive={isSideNavExpanded}
                    >
                    </HeaderMenuButton>
                </CustomWideMenu>

                <HeaderName
                    href="/"
                    prefix=""
                    className={`logo-header-name ${isSearchBarExpanded ? 'has-search-active' : ''}`}
                >
                    <img src={document.documentElement.getAttribute(
                        "data-carbon-theme") !== null &&
                        document.documentElement.getAttribute(
                            "data-carbon-theme") !== 'white' ? logoNameDark : logoName} className="logo-img" alt="logo" />
                </HeaderName>

                {
                    !isMobile && (
                        <HeaderName
                            className={`seperatorHead ${isSearchBarExpanded ? 'has-search-active' : ''}`}
                            prefix=""
                        >
                            <div className="logoSeperator" />
                        </HeaderName>
                    )
                }

                {
                    (
                        <DropdownTabList
                            className={`${isSearchBarExpanded ? 'has-search-active' : ''}`}
                        >
                        </DropdownTabList>
                    )
                }

                <HeaderGlobalBar>
                    {
                        !isMobile && (
                            <HeaderTab className={isSearchBarExpanded ? 'has-search-active' : ''} />
                        )
                    }
                    <MastheadSearch
                        placeHolderText="Search all of Bynar"
                        isSearchActive={isSearchBarExpanded}
                        onChangeSearchActive={(event, { isOpen }) => {
                            setIsSearchBarExpanded(isOpen)
                        }}></MastheadSearch>
                </HeaderGlobalBar>

                <Popover
                    ref={wrapperRef}
                    open={isProfileDropdownOpen}
                    isTabTip
                    align="bottom-right"
                    className={`popover-dropdown ${isSearchBarExpanded ? 'has-search-active' : ''}`}
                >
                    <HeaderGlobalAction
                        aria-label={user?.fullName ?? t("user")}
                        onClick={() => {
                            setIsProfileDropdownOpen(!isProfileDropdownOpen);
                            setSearchParams((prev) =>
                                omitQueryParams(prev, [
                                    "userIdToShowDetails",
                                    "openAddUserPanel",
                                    "userIdToBeEdited",
                                    "openCardMangementPanel",
                                ])
                            );
                        }}
                    >
                        <UserProfileImage
                            backgroundColor={user?.profileURL ? "transparent" : "light-cyan"}
                            size={"md"}
                            initials={user?.fullName.match(/(^\S)/)?.[0].toUpperCase() ?? "..."}
                            image={user?.profileURL ?? ""}
                            theme={
                                theme === "g90"
                                    ? "dark"
                                    : "light"
                            }
                        />
                    </HeaderGlobalAction>
                    <PopoverContent className="custom-popover-content">
                        <ProfileDropdown
                            onProfileOptionClick={() => {
                                setSearchParams({
                                    userIdToShowDetails:
                                        user?.id,
                                });
                                setIsProfileDropdownOpen(false);
                            }}
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
                isUploadProfileImageModalOpen={isUploadProfileImageModalOpen}
                openUploadProfileImageModal={openUploadProfileImageModal}
            />
        </>
    );
}

// AuthenticatedAppHeader is the header component for the authenticated app with the providers
export default function AuthenticatedAppHeader(props) {
    return (
        <CardManagementProvider>
            <OrganizationAccountProvider>
                <div className="main-header-container">
                    <HeaderContainer {...props} render={_AuthenticatedAppHeader} />
                </div>
                <Outlet />
            </OrganizationAccountProvider>
        </CardManagementProvider>
    );
}
