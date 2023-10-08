import { useContext } from "react";
import { TabContext } from "../../sdk";
import './Dashboard.scss'
import { TabPanel, TabPanels, Tabs } from "@carbon/react";

const Dashboard = () => {
    const { tab, activeTab } = useContext(TabContext);
    return (
        <div className="dashboard-container">
            <Tabs selectedIndex={ activeTab }>
                <TabPanels>
                    {
                        tab.map(tab => {
                            return <TabPanel className="content-wrapper">{ tab.content }</TabPanel>
                        })
                    }
                </TabPanels>
            </Tabs>
        </div>
    );
};
export default Dashboard
