import { TreeGrid } from "../../index";

// InvoiceList is the invoice list component
const InvoiceList = ({ tabId }) => {
    // events is an object that contains all the event handlers for the TreeGrid
    const events = {}

    events.OnRowAdd = function (G, row) {
        // Set the value of the group field when adding data after grouping
        if (G.Group !== "") {
            let parentNode = row.parentNode
            for (let key of G.Group.split(",").reverse()) {
                // Recursively parent node to get the value of the group field
                while (parentNode !== undefined) {
                    if (parentNode.Visible === 1 && parentNode[G.MainCol] !== undefined) {
                        row[key] = parentNode[G.MainCol]
                        parentNode = parentNode.parentNode
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
