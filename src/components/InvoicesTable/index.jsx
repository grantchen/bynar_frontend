import React from "react";
import "./invoices-table.scss";
import { TreeGrid } from "../TreeGrid";


const InvoicesTable = ({tabId}) => {
    return (
        <>
            <div style={ { height: '400px' } }>
                <TreeGrid
                    table={ "invoices" }
                    config={ {
                        Debug: '',
                    } }
                    tabId={tabId}
                ></TreeGrid>
            </div>
        </>
    );
};

export default InvoicesTable;
