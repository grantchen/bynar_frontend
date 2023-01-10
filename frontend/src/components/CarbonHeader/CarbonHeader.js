import React, { useContext, useState } from 'react';
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
  TextInput,
  Dropdown,
  SideNavMenuItem,
  SideNavDivider,
  SideNavMenu,
  Switcher,
  SwitcherItem,
  HeaderPanel,
} from '@carbon/react';
import { Search, Notification, User, Calculator, Notebook, Help } from '@carbon/react/icons';

const CarbonHeader = () => {
    let navigate = useNavigate();
    let [profilePanelExpanded, setProfilePanelExpanded] = useState(true);
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
                style={{'display': 'block'}}
              />
              <HeaderName href="/" prefix="Bynar">
                ERP
              </HeaderName>
              <TextInput
                className="input-test-class hidden-mobile"
                id="bynar-search"
                onChange={function noRefCheck(){}}
                onClick={function noRefCheck(){}}
                placeholder="Search resources and products..."
                size="lg"
                type="text"
                labelText=""
                style={{'borderBottom': 'none'}}
              />
              <HeaderGlobalAction className='hidden-mobile' style={{'backgroundColor': '#262626'}} aria-label="Search" tooltipAlignment="end">
                <Search size={20} />
              </HeaderGlobalAction>
              <Dropdown
                id="bynar-search-dropdown"
                items={['Pfk Albania', 'Pfk Italy', 'Pfk Germany']}
                size="lg"
                label="Region"
                initialSelectedItem={'Pfk Albania'}
                className="bynar-search-dropdown hidden-mobile"
              />
              <SideNav
                aria-label="Side navigation"
                expanded={isSideNavExpanded}
                isPersistent={false}
              >
                <SideNavItems>
                  <SideNavMenuItem aria-current="page"    >
                    Dashboard
                  </SideNavMenuItem>
                  <SideNavDivider/>
                  <SideNavMenu title="Settings">
                    <SideNavMenuItem >
                      Setting 1
                    </SideNavMenuItem>
                    <SideNavMenuItem >
                      Setting 2
                    </SideNavMenuItem>
                    <SideNavMenuItem >
                      Setting 3
                    </SideNavMenuItem>
                  </SideNavMenu>
                </SideNavItems>
              </SideNav>
      
              <HeaderGlobalBar className="header-right-buttons" >
                <HeaderGlobalAction aria-label="Help" tooltipAlignment="end">
                  <Help size={20} />
                </HeaderGlobalAction>
                <HeaderGlobalAction aria-label="Video" tooltipAlignment="end">
                  <Notebook size={20} />
                </HeaderGlobalAction>
                <HeaderGlobalAction aria-label="Calculator" tooltipAlignment="end">
                  <Calculator size={20} />
                </HeaderGlobalAction>
                <HeaderGlobalAction aria-label="Notifications" tooltipAlignment="center">
                  <Notification size={20} />
                </HeaderGlobalAction>
                <HeaderGlobalAction aria-label="Profile" onClick={() => { setProfilePanelExpanded(!profilePanelExpanded) }} tooltipAlignment="center">
                  <User size={20} />
                </HeaderGlobalAction>
              </HeaderGlobalBar>

              <HeaderPanel expanded={profilePanelExpanded} aria-label="test">
                <Switcher aria-label="test">
                  <SwitcherItem aria-label="test">
                    Test
                  </SwitcherItem>
                </Switcher>
              </HeaderPanel>
            </Header>
          )}
        />
      );
}

export default CarbonHeader;