import { TreeGrid } from "../../index";

// WarehousesList is the warehouse list component
const WarehousesList = ({ tabId }) => {
    // events is an object that contains all the event handlers for the TreeGrid
    const events = {}

    return (
        <>
            <div className="tree-grid-content">
                <TreeGrid
                    table={ "warehouses" }
                    tabId={ tabId }
                    events={ events }
                ></TreeGrid>
            </div>
        </>
    );
};

export default WarehousesList;
