import React from "react";
import "./invoices-table.scss";
import { TreeGrid } from "../TreeGrid";

const InvoicesTable = ({ tabId }) => {
    return (
        <>
            <TreeGrid
                table={ "invoices" }
                config={ {
                    Debug: '',
                } }
                tabId={ tabId }
            ></TreeGrid>
        </>
    );
};

export default InvoicesTable;
