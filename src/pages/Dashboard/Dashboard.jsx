import { useContext } from "react";
import { TabContext } from "../../sdk";
import './Dashboard.scss'

export const Dashboard = () => {
  const { tab, activeTab } = useContext(TabContext);
  const tabContent = tab?.[activeTab]?.content;
  return (
    <div
      className="dashboard-container"
    >
      {tabContent}
    </div>
  );
};
