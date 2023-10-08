import React from "react";
import "./UserList.scss";
import { TreeGrid } from "../TreeGrid";

const UserList = () => {
    return (
        <>
            <div className="user-list" style={ { height: '400px'} }>
                <TreeGrid
                    table={ "user_list" }
                    config={ {
                        Debug: '',
                    } }
                ></TreeGrid>
            </div>
        </>
    );
};

export default UserList;
