import { TreeGrid } from "../../index";

// InvoiceList is the invoice list component
const InvoiceList = ({ tabId }) => {
    // events is an object that contains all the event handlers for the TreeGrid
    const events = {}

    events.OnRowAdd = function (G, row) {
        // Set the value of the group field when adding data after grouping
        if (G.Group !== "") {
            for (let key of G.Group.split(",")) {
                let parentNode = row.parentNode
                // Recursively parent node to get the value of the group field
                while (parentNode !== undefined) {
                    if (parentNode.Visible === 1 && parentNode[key] !== undefined) {
                        row[key] = parentNode[key]
                        break
                    }
                    parentNode = parentNode.parentNode
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
                    events={ events }
                ></TreeGrid>
            </div>
        </>
    );
};

export default InvoiceList;
