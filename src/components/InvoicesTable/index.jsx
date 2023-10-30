import React, { useRef } from "react";
import "./invoices-table.scss";
import { TreeGrid } from "../TreeGrid";

const InvoicesTable = ({ tabId }) => {
    const iframeRef = useRef();

    function iframeDidMount() {
        const window = iframeRef.current.contentWindow

        // do something
    }

    return (
        <>
            <div className="tree-grid-content">
                <TreeGrid
                    table={ "invoices" }
                    tabId={ tabId }
                    ref={ iframeRef }
                    iframeDidMount={ iframeDidMount }
                ></TreeGrid>
            </div>
        </>
    );
};

export default InvoicesTable;
