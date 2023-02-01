import React, { useState, useRef, useEffect } from 'react';

import { AccountContext } from './Accounts';

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
import { createNotification } from '../../store/appstate/appstate';
const { getSession } = useContext(AccountContext)

const DashboardContent = () => {
  const dispatch = useDispatch();

  const insertIntoDB = () => {
    getSession().then(({ accessToken, headers }) => {
      if (typeof accessToken !== 'string') {
        accessToken = accessToken.jwtToken
      }

      const uri = `${API}?accessToken=${accessToken}`
      console.log(uri)

      fetch(uri, {
        headers,
      })
        .then((data) => {
            console.log(data.json());
            return data.json();
        })
        .then(setImage)
        .catch(console.error)
    })
  };

  return (<div>
    
      <Heading>
        Pkf Albania
      </Heading>
      <Button
      title="Insert into DB"
      onClick={insertIntoDB}
      />
      <Grid style={{ 'paddingTop': '1rem' }} >
        <Column className='bynar-info-column' lg={4} md={8} sm={4}>
          <Tile className='bynar-dashboard-tile bynar-tile-blue' >
            <div className='bynar-tile-header' style={{ 'height': '1rem', 'width': '100%' }} >
              <h5 style={{ 'maxWidth': 'fit-content', 'float': 'left' }} ><strong>News</strong></h5>
              <Link style={{ 'float':'right', 'color': 'white' }} onClick={() => dispatch(createNotification('Success', 'Action succeed','success'))} >View all</Link>
            </div>
            <br/>
            <div className='bynar-tile-content-area' >
              <p>News 1</p>
              <p>News 2</p>
              <p>News 3</p>
            </div>
          </Tile>
        </Column>
        <Column className='bynar-info-column' lg={8} md={8} sm={4}>
          <Tile className='bynar-dashboard-tile' style={{ 'backgroundColor': 'white', 'color': '#161616' }} >
            <div className='bynar-tile-header' style={{ 'height': '1rem', 'width': '100%' }} >
              <h5 style={{ 'maxWidth': 'fit-content', 'float': 'left' }} ><strong>Usage</strong></h5>
              <Link style={{ 'float':'right' }} >View all</Link>
            </div>
            <br/>
            <div className='bynar-tile-content-area' >
              <Warning size='100' style={{ 'margin': 'auto', 'color': 'cornflowerblue' }} />
              <p>Widget cannot be loaded this time</p>
            </div>
          </Tile>
        </Column>
        <Column className='bynar-info-column' lg={4} md={8} sm={4}>
          <Tile className='bynar-dashboard-tile' style={{ 'backgroundColor': 'white', 'color': '#161616' }} >
            <div className='bynar-tile-header' style={{ 'height': '1rem', 'width': '100%' }} >
              <h5 style={{ 'maxWidth': 'fit-content', 'float': 'left' }} ><strong>Recent support cases</strong></h5>
              <Link style={{ 'float':'right' }} >View usage</Link>
            </div>
            <br/>
            <div className='bynar-tile-content-area' >
              <InformationDisabled size='100' style={{ 'margin': 'auto', 'color': 'cornflowerblue' }} />
              <p>You don't have permission to see support cases</p>
            </div>
          </Tile>
        </Column>
      </Grid>
      <Grid style={{ 'paddingTop': '2rem' }} >
        <Column lg={16} md={8} sm={4}>
        <Tile className='bynar-dashboard-tile' style={{ 'backgroundColor': 'white' }} >
          <div className='bynar-tile-header' style={{ 'height': '1rem', 'width': '100%' }} >
            <h5 style={{ 'maxWidth': 'fit-content', 'float': 'left' }} ><strong>Tools</strong></h5>
            <Link style={{ 'float':'right' }} >Application or data migration</Link>
          </div>
          <div className='bynar-tile-content-area' >
            <div className='bynar-tool-cards' style={{ 'display': 'flex', 'overflowX': 'auto' }} >
              <Tile className='bynar-dashboard-sub-tile bynar-tile-blue' >
                <h5 style={{ 'maxWidth': 'fit-content' }} ><strong>Build</strong></h5>
                <div className='bynar-tile-content-area' >
                  <p>Explore Bynar</p>
                </div>
              </Tile>
              <Tile className='bynar-dashboard-sub-tile' >
                <h5 style={{ 'maxWidth': 'fit-content' }} ><strong>Browse, select and create a database</strong></h5>
                <div className='bynar-tile-content-area' >
                  <p>Explore Bynar database</p>
                </div>
              </Tile>
              <Tile className='bynar-dashboard-sub-tile' >
                <h5 style={{ 'maxWidth': 'fit-content' }} ><strong>Browse, select and create a database</strong></h5>
                <div className='bynar-tile-content-area' >
                  <p>Explore Bynar database</p>
                </div>
              </Tile>
            </div>
          </div>
        </Tile>
        </Column>
      </Grid>
  </div>);
}

export default DashboardContent;