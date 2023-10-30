import React, { useRef } from "react";
import { TreeGrid } from "../../index";

const WarehousesList = ({ tabId }) => {
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

export default WarehousesList;
