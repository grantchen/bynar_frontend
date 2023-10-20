import React from "react";
import "./UserList.scss";
import { TreeGrid } from "../TreeGrid";

const UserList = ({ tabId }) => {
    return (
        <>
            <div className="tree-grid-content">
                <TreeGrid
                    table={ "user_list" }
                    tabId={ tabId }
                ></TreeGrid>
            </div>
        </>
    );
};

export default UserList;
