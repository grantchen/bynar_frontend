import { TreeGrid } from "../../index";

// InvoiceList is the invoice list component
const InvoiceList = ({ tabId }) => {
    // events is an object that contains all the event handlers for the TreeGrid
    const events = {}

    return (
        <>
            <div className="tree-grid-content">
                <TreeGrid
                    table={ "invoices" }
                    tabId={ tabId }
                    events={ events }
                ></TreeGrid>
            </div>
        </>
    );
};

export default InvoiceList;
