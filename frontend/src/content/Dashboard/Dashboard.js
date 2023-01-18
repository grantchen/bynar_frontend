import React, { useState, useRef, useEffect } from 'react';

import {
  Heading,
  FlexGrid,
  Row,
  Column,
  Grid,
  Tile,
  Link,
  ActionableNotification,
  Tabs,
  Tab,
  TabList,
  TabPanels,
  TabPanel,
  Button,
  Dropdown,
} from '@carbon/react';
import { Warning, InformationDisabled, CloseOutline, AddAlt } from '@carbon/react/icons';
import { useDispatch, useSelector } from 'react-redux'
import { openNewTab, closeTab, setSelectedTab } from '../../store/appstate/appstate';

const Dashboard = () => {
  const dispatch = useDispatch();

  const tabs = useSelector(state => state.appState.tabs);
  const selectedTab = useSelector(state => state.appState.selectedTab);

  const addNewTab = (id, title, component) => {
    const tabFound = tabs.find(tab => tab.id == id);
    if (tabFound) {
      const tabIndex = tabs.findIndex(tab => tab.id == id);
      dispatch(setSelectedTab(tabIndex));
    } else {
      dispatch(openNewTab(id, title, component));
      dispatch(setSelectedTab(tabs.length));
      window.dispatchEvent(new Event('resize'));
    }
    
  };

  return (<div>
    <div className='content-tabs-wrapper' >
      
      <Dropdown
              id="bynar-tabs-menu-dropdown"
              items={[
                { 'id': 'testpage1', 'text': 'Test Page 1' },
                { 'id': 'testpage2', 'text': 'Test Page 2' },
                { 'id': 'testpage3', 'text': 'Test Page 3' },
                { 'id': 'testpage4', 'text': 'Test Page 4' },
              ]}
              itemToElement={(item) =>
                item ? (
                  <span>
                    {item.text}
                  </span>
                ) : (
                  ''
                )
              }
              size="sm"
              label={<div><AddAlt/><span style={{ 'position': 'absolute', 'marginLeft': '1rem' }} >Add new tab</span></div>}
              selectedItem={0}
              onChange={(selectionObject) => {
                const selectedItem = selectionObject.selectedItem;
                addNewTab(selectedItem.id, selectedItem.text, <div>{selectedItem.text}</div>);
              }}
              // initialSelectedItem={'Pfk Albania'}
            />
      <Tabs selectedIndex={selectedTab} >
        <TabList aria-label="List of tabs" activation="automatic" scrollIntoView={true}>
          {
            tabs.map((tab, key) => (
              <Tab data-id={key} style={{ 'outline': 'none' }} onClick={(event) => {
                console.log(event.target);
                let tabIndex = event.currentTarget.getAttribute('data-id');
                dispatch(setSelectedTab(parseInt(tabIndex)));
              }} key={key} ><div>{tab.title}
                {
                  (key != 0 ? (
                    <div className='tab-close-button' onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      let tabIndex = parseInt(event.currentTarget.parentElement.parentElement.getAttribute('data-id'));
                      if (tabIndex == 0) return;
                      dispatch(closeTab(parseInt(tabIndex)));
                      if (selectedTab >= tabIndex) {
                        dispatch(setSelectedTab(selectedTab - 1));
                      }
                      
                      window.dispatchEvent(new Event('resize'));
                    }} ><CloseOutline /></div>
                  ) : '')
                }
                </div>
              </Tab>
            ))
          }
        </TabList>
        <TabPanels>
          { 
            tabs.map((tab, key) => (
              <TabPanel className='bynar-tab-panel' data-id={key} key={key} >{tab.component}</TabPanel>
            ))
          }
        </TabPanels>
      </Tabs>
    </div>
    
      
  </div>);
};

export default Dashboard;