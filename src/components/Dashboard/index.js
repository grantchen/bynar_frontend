import React, { useContext } from 'react';

import '../Dashboard/Dashboard.scss'
import { TabContext } from '../../sdk';

const Dashboard = () => {
  const { tab, activeTab } = useContext(TabContext);

  return (
  <div>
      <div className={'active-tab'}>
         {tab[activeTab-1]?.content}
       </div>
  </div>

  );
}

export default Dashboard;
