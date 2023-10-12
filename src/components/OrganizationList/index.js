import React from "react";
import "./OrganizationList.scss";
import { TreeGrid } from "../TreeGrid";

const OrganizationList = ({ tabId }) => {
    return (
        <>
            <TreeGrid
                table={ "organizations" }
                config={ {
                    Debug: '',
                } }
                tabId={ tabId }
            ></TreeGrid>
        </>
    );
};

export default OrganizationList;
