import React, { useState, useEffect, useRef } from 'react';
import {
  Header,
  HeaderMenuButton,
  HeaderName,
  HeaderGlobalBar,
  HeaderGlobalAction
} from 'carbon-components-react';
import HeaderContainer from "carbon-components-react/lib/components/UIShell/HeaderContainer";
import {
  Notification20, Search20, UserAvatar20
} from '@carbon/icons-react';
import { Navbar } from '../Navbar/Navbar';
import { NotificationPanel } from '../NotificationPanel/NotificationPanel';
import { sampleData } from '../NotificationPanel/NotificationData';
import '../../sdk/theme/Themes.scss'
import Dashboard from '../Dashboard/Dashboard';
import { Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ProfileDropdown from '../ProfileDropdown/ProfileDropdown';
import HeaderTabComponents from './HeaderTabComponents';
import HeaderTab from './HeaderTab';

export const CommonHeader = () => {
  return (
    <div >
      <HeaderContainer
        render={HeaderComponent}
      />
    </div>
  );
};


const HeaderComponent = ({ isSideNavExpanded, onClickSideNavExpand }) => {
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [open, setOpen] = useState(false);
  const [notificationsData, setNotificationsData] = useState(sampleData);

  const wrapperRef = useRef(null);
  const showProfilePanelRef = useRef(null);
  const setShowProfilePanelRef = useRef(null);
  showProfilePanelRef.current = profileDropdown;
  setShowProfilePanelRef.current = setProfileDropdown;
  const { t } = useTranslation();

  const handleDropDown = (e) => {
    e.preventDefault();
    setProfileDropdown((profileDropdown) => !profileDropdown);
  }


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        if (showProfilePanelRef.current) {
          setShowProfilePanelRef.current(false);
          console.log("check")
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };

  }, [wrapperRef]);



  return (
    <>
      <div  >
        <Header aria-label="IBM Platform Name" style={{ backgroundColor: '#FFFFFF' }}>
          <HeaderMenuButton
            aria-label="Open menu"
            isCollapsible
            onClick={onClickSideNavExpand}
            isActive={isSideNavExpanded}
          />
          <div className={isSideNavExpanded?'header-container-box':'header-box'}>
          <HeaderName className="heading-content" prefix={t('')}>{t('Bynar')}</HeaderName>
          <div className='border-outline'></div>
          <HeaderName className="heading-content-new" prefix={t('')}>{t('platform')}</HeaderName>
          <HeaderTab />
          <div className='border-outline'></div>
          <HeaderGlobalBar className='header-tab'>
            <HeaderGlobalAction aria-label="Search" onClick={() => { }}>
              <Search20 />
            </HeaderGlobalAction>
            {/* <HeaderGlobalAction aria-label="Notifications" onClick={() => setOpen(!open)}>
            <Notification20 />
          </HeaderGlobalAction> */}
            <div ref={wrapperRef}>
              <>
                <HeaderGlobalAction className='header-tab' aria-label="User" onClick={handleDropDown}>
                  <UserAvatar20 />
                </HeaderGlobalAction>
                {profileDropdown && <ProfileDropdown />}
              </>
            </div>
          </HeaderGlobalBar>
          </div>
          <Navbar isSideNavExpanded={isSideNavExpanded} />
        </Header>
        <Outlet />
        {/* <div className="main--content">
        <NotificationPanel open={open} setOpen={setOpen} setNotificationsData={setNotificationsData} notificationsData={notificationsData} />
      </div> */}
      </div>
    </>
  )
}
