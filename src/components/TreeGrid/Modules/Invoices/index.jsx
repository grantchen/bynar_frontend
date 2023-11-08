import { TreeGrid } from "../../index";

const InvoiceList = ({ tabId }) => {
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
