import React, { useRef } from "react";
import "./UserList.scss";
import { TreeGrid } from "../TreeGrid";

const UserList = ({ tabId }) => {
    const iframeRef = useRef();

    function iframeDidMount() {
        const window = iframeRef.current.contentWindow

        // do something
    }

    return (
        <>
            <div className="tree-grid-content">
                <TreeGrid
                    table={ "user_list" }
                    tabId={ tabId }
                    ref={ iframeRef }
                    iframeDidMount={ iframeDidMount }
                ></TreeGrid>
            </div>
        </>
    );
};

export default UserList;
