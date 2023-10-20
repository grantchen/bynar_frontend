import React from "react";
import "./invoices-table.scss";
import { TreeGrid } from "../TreeGrid";

const InvoicesTable = ({ tabId }) => {
    return (
        <>
            <div className="tree-grid-content">
                <TreeGrid
                    table={ "invoices" }
                    tabId={ tabId }
                ></TreeGrid>
            </div>
        </>
    );
};

export default InvoicesTable;
