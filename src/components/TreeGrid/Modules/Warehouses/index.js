import { TreeGrid } from "../../index";

const WarehousesList = ({ tabId }) => {
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
