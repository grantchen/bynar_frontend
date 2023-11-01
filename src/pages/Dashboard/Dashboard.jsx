import React, { Suspense, useContext } from "react";
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
                        tab.map((item, index) => {
                            return <TabPanel
                                className="content-wrapper"
                                key={ item.id }
                                style={ {
                                    display: "block", // treegrid does not load page data if display none, use visible(absolute position) instead
                                    visibility: index === activeTab ? "visible" : "hidden",
                                    overflow: index === activeTab ? "unset" : "hidden",
                                } }>
                                <Suspense
                                    fallback={ <div style={ { display: 'none' } }>Loading...</div> }
                                >
                                    { item.content }
                                </Suspense>
                            </TabPanel>
                        })
                    }
                </TabPanels>
            </Tabs>
        </div>
    );
};
export default Dashboard
