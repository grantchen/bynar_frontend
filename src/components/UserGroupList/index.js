import React from "react";
import "./UserGroupList.scss";
import { TreeGrid } from "../TreeGrid";

const UserGroupList = ({ tabId }) => {
    return (
        <>
            <div className="tree-grid-content">
                <TreeGrid
                    table={ "user_groups" }
                    config={ {
                        Debug: '',
                    } }
                    tabId={ tabId }
                ></TreeGrid>
            </div>
        </>
    );
};

export default UserGroupList;
