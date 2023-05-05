import { useContext } from "react";
import { TabContext } from "../../sdk";

export const Dashboard = () => {
  const { tab, activeTab } = useContext(TabContext);
  const tabContent = tab?.[activeTab]?.content;
  return (
    <div
      style={{ paddingTop: "6rem", paddingLeft: "4rem", paddingRight: "4rem" }}
    >
      {tabContent}
    </div>
  );
};
