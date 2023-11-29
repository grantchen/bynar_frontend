import React, { Suspense, useContext } from "react";
import { TabContext } from "../../sdk";
import './Dashboard.scss'
import { TabPanel, TabPanels, Tabs } from "@carbon/react";

// Dashboard is a component that renders the content of the selected tab
const Dashboard = () => {
    const { tab, activeTab } = useContext(TabContext);
    return (
        <div className="dashboard-container">
            <Tabs selectedIndex={ activeTab }>
                <TabPanels>
                    {
                        tab.map((item, index) => {
                            return <TabPanel
                                className={ `tab-content-wrapper tab-content-${index}` }
                                key={ item.id }
                                style={ {
                                    // doc: `Data source to download data for individual page or child page. It is loaded on request, when the page is being displayed.`
                                    // treegrid does not load page data if display none, use visible(absolute position) instead
                                    display: "block",
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
