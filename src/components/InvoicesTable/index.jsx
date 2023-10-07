import React from "react";
import "./invoices-table.scss";
import { TreeGrid } from "../TreeGrid";

const InvoicesTable = () => {
    return (
        <>
            <div style={ { height: '400px' } }>
                <TreeGrid
                    table={ "invoices" }
                    config={ {
                        Debug: '',
                    } }
                ></TreeGrid>
            </div>
        </>
    );
};

export default InvoicesTable;
