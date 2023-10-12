import React from "react";
import "./UserList.scss";
import { TreeGrid } from "../TreeGrid";

const UserList = ({ tabId }) => {
    return (
        <>
            <TreeGrid
                table={ "user_list" }
                config={ {
                    Debug: ''
                } }
                tabId={ tabId }
            ></TreeGrid>
        </>
    );
};

export default UserList;
