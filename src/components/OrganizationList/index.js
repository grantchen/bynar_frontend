import React from "react";
import "./OrganizationList.scss";
import { TreeGrid } from "../TreeGrid";

const OrganizationList = ({ tabId }) => {
    return (
        <>
            <div className="tree-grid-content">
                <TreeGrid
                    table={ "organizations" }
                    tabId={ tabId }
                ></TreeGrid>
            </div>
        </>
    );
};

export default OrganizationList;
