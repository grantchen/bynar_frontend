import React, { useState, useRef, useEffect, useContext } from 'react';

import '../Dashboard/Dashboard.scss'
import { TabContext } from '../../sdk/context/TabContext';

const Dashboard = () => {
  const { tab, activeTab } = useContext(TabContext);

  return (
  <div> 
      <div  className={'active-tab'}>
         {tab[activeTab-1]?.content}
       </div>
  </div>
  
  );
}

export default Dashboard;