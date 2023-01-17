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

  const addNewTab = (title, component) => {
    dispatch(openNewTab(title, component));
    dispatch(setSelectedTab(tabs.length));
  };

  return (<div>
    <div className='content-tabs-wrapper' >
      {
        (selectedTab != 0 ? (
        <Button id="close-tab-button" size="sm" onClick={() => {
            if (selectedTab == 0) return;
            dispatch(closeTab(selectedTab));
            dispatch(setSelectedTab(selectedTab - 1));
          }} kind="ghost">
          <CloseOutline />
        </Button>
        ) : '')
      }
      
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
                addNewTab(selectedItem.text, <div>{selectedItem.text}</div>);
              }}
              // initialSelectedItem={'Pfk Albania'}
            />
      <Tabs selectedIndex={selectedTab} >
        <TabList aria-label="List of tabs" activation="automatic" scrollIntoView={true}>
          {
            tabs.map((tab, key) => (
              <Tab data-id={key} onClick={(event) => {
                let tabIndex = event.currentTarget.getAttribute('data-id');
                setSelectedTab(parseInt(tabIndex));
              }} key={key} >{tab.title}</Tab>
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