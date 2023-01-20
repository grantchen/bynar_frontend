import React, { useContext, useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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
  Link,
  Tile,
} from '@carbon/react';
import { Search, Notification, User, Calculator, Notebook, Help, Close } from '@carbon/react/icons';
import { useSelector, useDispatch } from 'react-redux';
import { applyDarkTheme, applyLightTheme } from '../../store/appstate/appstate';
import ProfileSettingsPanel from './ProfileSettingsPanel';


const CarbonHeader = () => {
    const dispatch = useDispatch();
    let navigate = useNavigate();
    let [rightPanelExpanded, setRightPanelExpanded] = useState(false);
    let [showProfileSettingsPanel, setShowProfileSettingsPanel] = useState(false);
    let [showMobileSearch, setShowMobileSearch] = useState(false);
    

    //--- auto close profile panel if clicked outside panel
    //--- code start
    const showProfileSettingsPanelRef = useRef(null);
    const setShowProfileSettingsPanelRef = useRef(null);
    showProfileSettingsPanelRef.current = showProfileSettingsPanel;
    setShowProfileSettingsPanelRef.current = setShowProfileSettingsPanel;
    const wrapperRef = useRef(null);
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
          if (showProfileSettingsPanelRef.current) {
            setShowProfileSettingsPanelRef.current(false);
          }
        }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [wrapperRef]);
    //--- code end


    const theme = useSelector(state => state.appState.theme);
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
                className="hidden-tablet"
                id="bynar-search"
                onChange={function noRefCheck(){}}
                onClick={function noRefCheck(){}}
                placeholder="Search resources and products..."
                size="lg"
                type="text"
                labelText=""
              />
              <HeaderGlobalAction className="bynar-search-input-button hidden-tablet" aria-label="Search" tooltipAlignment="end">
                <Search size={20} />
              </HeaderGlobalAction>
              <Dropdown
                id="bynar-search-dropdown"
                items={['Pfk Albania', 'Pfk Italy', 'Pfk Germany']}
                size="lg"
                label="Region"
                initialSelectedItem={'Pfk Albania'}
                className={"bynar-search-dropdown hidden-tablet " + (theme == 'dark' ? "theme-dark" : "theme-light")}
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

              {showMobileSearch ? (
                <div className='bynar-search-mobile-wrapper show-tablet' >
                  <TextInput
                    className="show-tablet"
                    id="bynar-search-mobile"
                    onChange={function noRefCheck(){}}
                    onClick={function noRefCheck(){}}
                    placeholder="Search resources and products..."
                    size="lg"
                    type="text"
                    labelText=""
                  />
                  <HeaderGlobalAction className="bynar-search-input-button show-tablet" aria-label="Search" tooltipAlignment="end">
                    <Search size={20} />
                  </HeaderGlobalAction>
                  <HeaderGlobalAction className="bynar-search-input-button show-tablet" aria-label="Search" tooltipAlignment="end" onClick={() => setShowMobileSearch(false)}>
                    <Close size={20} />
                  </HeaderGlobalAction>
                </div>
              ) : ''}
      
              <HeaderGlobalBar className="header-right-buttons" >
                <HeaderGlobalAction className="show-tablet" aria-label="Search" tooltipAlignment="end" onClick={() => setShowMobileSearch(true)}>
                  <Search size={20} />
                </HeaderGlobalAction>
                {/* <HeaderGlobalAction aria-label="Help" tooltipAlignment="end">
                  <Help size={20} />
                </HeaderGlobalAction>
                <HeaderGlobalAction aria-label="Calculator" tooltipAlignment="end">
                  <Calculator size={20} />
                </HeaderGlobalAction> */}
                <HeaderGlobalAction  onClick={() => { setRightPanelExpanded(!rightPanelExpanded); }} aria-label="Notifications" tooltipAlignment="center">
                  <Notification size={20} />
                </HeaderGlobalAction>
                <ProfileSettingsPanel rightPanelExpanded={rightPanelExpanded} setRightPanelExpanded={setRightPanelExpanded} />
              </HeaderGlobalBar>

              

              <HeaderPanel expanded={rightPanelExpanded} aria-label="test">
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