import React from "react";
import "./UserList.scss";
import { TreeGrid } from "../TreeGrid";

const UserList = ({tabId}) => {
    return (
        <>
            <div className="user-list" style={ { height: '400px'} }>
                <TreeGrid
                    table={ "user_list" }
                    config={ {
                        Debug: ''
                    } }
                    tabId={tabId}
                ></TreeGrid>
            </div>
        </>
    );
};

export default UserList;
