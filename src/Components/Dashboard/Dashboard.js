import React, { useState, useRef, useEffect, useContext } from 'react';

import {
  Heading,
  Column,
  Grid,
  Tile,
  Link,
} from '@carbon/react';

import { Warning, InformationDisabled, CloseOutline, AddAlt } from '@carbon/react/icons';
import '../Dashboard/Dashboard.scss'
import { NewsInfoCard } from '../Cards/NewsInfoCard/NewsInfoCard.js';
import { ViewUsageCard } from '../Cards/ViewUsageCard/ViewUsageCard';
import { SupportCard } from '../Cards/SupportCard/SupportCard';
import { TabComponent } from '../Tabs/TabComponent';

const Dashboard = () => {
  return (
  <div> 
      <TabComponent/>
  </div>
  
  );
}

export default Dashboard;