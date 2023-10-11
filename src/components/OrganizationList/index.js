import React from "react";
import "./OrganizationList.scss";
import { TreeGrid } from "../TreeGrid";

const OrganizationList = ({ tabId }) => {
    return (
        <>
            <div style={{ height: '400px' }}>
                <TreeGrid
                    table={"organizations"}
                    config={{
                        Debug: '',
                    }}
                    tabId={tabId}
                ></TreeGrid>
            </div>
        </>
    );
};

export default OrganizationList;
