import React from "react";
import "./UserGroupList.scss";
import { TreeGrid } from "../TreeGrid";

const UserGroupList = ({ tabId }) => {
    return (
        <>
            <TreeGrid
                table={ "user_groups" }
                config={ {
                    Debug: '',
                } }
                tabId={ tabId }
            ></TreeGrid>
        </>
    );
};

export default UserGroupList;
