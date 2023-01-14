import React, { useContext, useState, useRef, useEffect } from 'react';

import {
  HeaderGlobalAction,
  Link,
  Tile,
} from '@carbon/react';
import { Search, Notification, User, Calculator, Notebook, Help } from '@carbon/react/icons';
import { useSelector, useDispatch } from 'react-redux';
import { applyDarkTheme, applyLightTheme } from '../../store/appstate/appstate';


const ProfileSettingsPanel = (props) => {
    const dispatch = useDispatch();
    let [showProfileSettingsPanel, setShowProfileSettingsPanel] = useState(false);

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
        <div ref={wrapperRef} >
        <HeaderGlobalAction aria-label="Profile" onClick={() => { 
          if (props.rightPanelExpanded) {
            props.setRightPanelExpanded(false);
          } else {
             setShowProfileSettingsPanel(!showProfileSettingsPanel);
          }
         }} >
                  <User size={20} />
                </HeaderGlobalAction>
                {showProfileSettingsPanel ? (
                <Tile className="bynar-profile-settings-panel" >
                  <div className='bynar-profile-info-wrapper' >
                    <h4 style={{ 'width': '20rem', 'margin': 'auto' }} >
                      Firstname Lastname
                    </h4>
                    <div className='profile-info-image' >
                      <User className='profile-info-image-icon' size={32} />
                    </div>
                  </div>
                  <ul style={{ 'marginTop': '1rem' }} >
                    <li className='bynar-profile-settings-item' ><Link>Profile</Link></li>
                    <li className='bynar-profile-settings-item' ><Link>Privacy</Link></li>
                    <li className='bynar-profile-settings-item' ><Link style={{ 'cursor': 'pointer' }} onClick={() => {
                      if (theme == 'dark') {
                        return dispatch(applyLightTheme());
                      } else {
                        return dispatch(applyDarkTheme());
                      }
                    }} >Change Theme</Link></li>
                    <li className='bynar-profile-settings-item' ><Link>Logout</Link></li>
                  </ul>
                </Tile>
              ) : ('')}
        </div>
      );
}

export default ProfileSettingsPanel;