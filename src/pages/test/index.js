import {
    SideNav,
    SideNavDivider,
    SideNavItems,
    SideNavLink,
    SideNavMenu,
    SideNavMenuItem,
} from "carbon-components-react";

import {
    HeaderContainer,
    ExpandableSearch,
    Content,
    Header,
    HeaderMenuButton,
    HeaderName,
    HeaderNavigation,
    HeaderMenu,
    HeaderMenuItem,
    HeaderGlobalBar,
    HeaderGlobalAction,
    HeaderPanel,
    HeaderSideNavItems,
    SkipToContent,
    Switcher,
    SwitcherItem,
    SwitcherDivider,
} from "@carbon/react";
import {
    Search,
    Notification,
    Fade,
    Switcher as SwitcherIcon,
} from "@carbon/react/icons";
import { Search20, UserAvatar20, UserData20 } from "@carbon/icons-react";
import "./test.scss";
import { useAuth, useThemePreference, useUserManagement } from "../../sdk";
import { useTranslation } from "react-i18next";
import { UserProfileImage } from "@carbon/ibm-products";
import { useState } from "react";
import HeaderTab from "../../components/Header/HeaderTab";
import { useSearchParams } from "react-router-dom";
import { useMemo } from "react";

function action(v) {
    return () => alert(v);
}
export default function Test() {
    const { user } = useAuth();
    const { t } = useTranslation();
    const { theme } = useThemePreference();
    const [showHeaderMainNav, setShowHeaderMainNav] = useState(true);
    const { isUserManagementAllowed } = useUserManagement();
    const [searchParams, setSearchParams] = useSearchParams();
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
                                {showHeaderMainNav && <HeaderTab />}
                                {isUserManagementAllowed ||
                                    (true && (
                                        <HeaderGlobalAction
                                            aria-label={t("user")}
                                            onClick={() =>
                                                setIsUserListOpen(true)
                                            }
                                            className="user-list-nav-button"
                                        >
                                            <UserData20 />
                                        </HeaderGlobalAction>
                                    ))}
                                <ExpandableSearch className="search-container" />
                                <HeaderGlobalAction
                                    aria-label={user?.fullName ?? t("user")}
                                    // onClick={handleDropDown}
                                    onClick={action("user dropdown click")}
                                >
                                    <UserProfileImage
                                        backgroundColor={"light-cyan"}
                                        size={"md"}
                                        initials={user?.fullName ?? "..."}
                                        theme={
                                            theme === "g90" ? "dark" : "light"
                                        }
                                    />
                                </HeaderGlobalAction>
                            </HeaderGlobalBar>
                            <SideNav
                                aria-label="Side navigation"
                                expanded={isSideNavExpanded}
                                isFixedNav
                                isRail
                            >
                                <SideNavItems>
                                    <SideNavMenu
                                        renderIcon={Fade}
                                        title="Category title"
                                    >
                                        <SideNavMenuItem href="#">
                                            Link
                                        </SideNavMenuItem>
                                        <SideNavMenuItem
                                            aria-current="page"
                                            href="#"
                                        >
                                            Link
                                        </SideNavMenuItem>
                                        <SideNavMenuItem href="#">
                                            Link
                                        </SideNavMenuItem>
                                    </SideNavMenu>
                                    <SideNavMenu
                                        renderIcon={Fade}
                                        title="Category title"
                                    >
                                        <SideNavMenuItem href="#">
                                            Link
                                        </SideNavMenuItem>
                                        <SideNavMenuItem href="#">
                                            Link
                                        </SideNavMenuItem>
                                        <SideNavMenuItem href="#">
                                            Link
                                        </SideNavMenuItem>
                                    </SideNavMenu>
                                    <SideNavMenu
                                        renderIcon={Fade}
                                        title="Category title"
                                    >
                                        <SideNavMenuItem href="#">
                                            Link
                                        </SideNavMenuItem>
                                        <SideNavMenuItem href="#">
                                            Link
                                        </SideNavMenuItem>
                                        <SideNavMenuItem href="#">
                                            Link
                                        </SideNavMenuItem>
                                    </SideNavMenu>
                                    <SideNavLink renderIcon={Fade} href="#">
                                        Link
                                    </SideNavLink>
                                    <SideNavLink renderIcon={Fade} href="#">
                                        Link
                                    </SideNavLink>
                                </SideNavItems>
                            </SideNav>
                        </Header>
                    )}
                />
            </div>

            <div class="cds--grid">test</div>
        </>
    );
}
