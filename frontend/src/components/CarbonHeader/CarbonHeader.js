import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AccountContext } from '../Accounts';

import {
  Header,
  HeaderContainer,
  HeaderName,
  HeaderNavigation,
  HeaderMenuButton,
  HeaderMenuItem,
  HeaderGlobalBar,
  HeaderGlobalAction,
  SkipToContent,
  SideNav,
  SideNavItems,
  HeaderSideNavItems,
} from '@carbon/react';
import { Switcher, Notification, UserAvatar } from '@carbon/react/icons';

const CarbonHeader = () => {
    let navigate = useNavigate();
    const { logout } = useContext(AccountContext);
    const logoutUser = () => {
        logout();
        navigate("/signin");
    }
    return (
        <HeaderContainer
          render={({ isSideNavExpanded, onClickSideNavExpand }) => (
            <Header aria-label="Carbon Header">
              <SkipToContent />
              <HeaderMenuButton
                aria-label="Open menu"
                onClick={onClickSideNavExpand}
                isActive={isSideNavExpanded}
              />
              <HeaderName href="/" prefix="IBM">
                Carbon Header
              </HeaderName>
              <HeaderNavigation aria-label="Carbon Header">
                <HeaderMenuItem href="/userlist">Users</HeaderMenuItem>
              </HeaderNavigation>
              <SideNav
                aria-label="Side navigation"
                expanded={isSideNavExpanded}
                isPersistent={false}
              >
                <SideNavItems>
                  <HeaderSideNavItems>
                    <HeaderMenuItem href="/repos">Repositories</HeaderMenuItem>
                  </HeaderSideNavItems>
                </SideNavItems>
              </SideNav>
      
              <HeaderGlobalBar>
                  <HeaderGlobalAction aria-label="Notifications" tooltipAlignment="center">
                      <Notification size={20} />
                  </HeaderGlobalAction>
                  <Link to="/profile">
                      <HeaderGlobalAction aria-label="User Avatar" tooltipAlignment="center">
                          <UserAvatar size={20} />
                      </HeaderGlobalAction>
                  </Link>
                  <HeaderGlobalAction aria-label="App Switcher" tooltipAlignment="end" onClick={logoutUser}>
                      <Switcher size={20} />
                  </HeaderGlobalAction>
              </HeaderGlobalBar>
            </Header>
          )}
        />
      );
}

export default CarbonHeader;