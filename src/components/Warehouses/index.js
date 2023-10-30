import React, { useRef } from "react";
import "./Warehouses.scss";
import { TreeGrid } from "../TreeGrid";

const Warehouses = ({ tabId }) => {
    const iframeRef = useRef();

    function iframeDidMount() {
        const window = iframeRef.current.contentWindow

        // do something
    }

    return (
        <>
            <div className="tree-grid-content">
                <TreeGrid
                    table={"warehouses"}
                    tabId={tabId}
                    ref={ iframeRef }
                    iframeDidMount={ iframeDidMount }
                ></TreeGrid>
            </div>
        </>
    );
};

export default Warehouses;
