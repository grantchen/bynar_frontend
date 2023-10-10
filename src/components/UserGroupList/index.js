import React from "react";
import "./UserGroupList.scss";
import { TreeGrid } from "../TreeGrid";

const UserGroupList = ({ tabId }) => {
    return (
        <>
            <div style={ { height: '400px' } }>
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
