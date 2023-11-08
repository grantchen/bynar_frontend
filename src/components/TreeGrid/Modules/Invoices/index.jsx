import React, { useRef } from "react";
import { TreeGrid } from "../../index";

const InvoiceList = ({ tabId }) => {
    const iframeRef = useRef();

    function iframeDidMount() {
        const window = iframeRef.current.contentWindow

        window.Grids.OnRowAdd = function (G, row) {
            // Set the value of the group field when adding data after grouping
            if (G.Group !== "") {
                for (let key of G.Group.split(",")) {
                    let parentNode = row.parentNode
                    // Recursively parent node to get the value of the group field
                    while (parentNode !== undefined) {
                        if (parentNode[key] !== undefined) {
                            row[key] = parentNode[key]
                            break
                        }
                        parentNode = parentNode.parentNode
                    }
                }
            }
        }
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

export default InvoiceList;
