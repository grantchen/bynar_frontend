import React, { useRef } from "react";
import { TreeGrid } from "../../index";

const SaleList = ({ tabId }) => {
    const iframeRef = useRef();

    function iframeDidMount() {
        const window = iframeRef.current.contentWindow

        // do something
    }

    return (
        <>
            <div className="tree-grid-content">
                <TreeGrid
                    table={ "sales" }
                    tabId={ tabId }
                    ref={ iframeRef }
                    iframeDidMount={ iframeDidMount }
                ></TreeGrid>
            </div>
        </>
    );
};

export default SaleList;
