import React from "react";
import "./invoices-table.scss";
import { TreeGrid } from "../TreeGrid";

const InvoicesTable = ({ tabId }) => {
    return (
        <>
            <div className="tree-grid-content">
                <TreeGrid
                    table={ "invoices" }
                    config={ {
                        Debug: '',
                    } }
                    tabId={ tabId }
                ></TreeGrid>
            </div>
        </>
    );
};

export default InvoicesTable;
