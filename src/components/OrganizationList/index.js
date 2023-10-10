import React from "react";
import "./OrganizationList.scss";
import { TreeGrid } from "../TreeGrid";

const OrganizationList = () => {
    return (
        <>
            <div style={ { height: '400px'} }>
                <TreeGrid
                    table={ "organizations" }
                    config={ {
                        Debug: '',
                    } }
                ></TreeGrid>
            </div>
        </>
    );
};

export default OrganizationList;
