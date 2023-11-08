import React, { useRef } from "react";
import { TreeGrid } from "../../index";

const UserList = ({ tabId }) => {
    const events = {}

    events.Grids.OnRowAdd = function (G, row) {
        // Set the value of the group field when adding data after grouping
        if (G.Group !== "") {
            for (let key of G.Group.split(",")) {
                let parentNode = row.parentNode
                // Recursively parent node to get the value of the group field
                while (parentNode !== undefined) {
                    if (parentNode[key] !== undefined) {
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
                    table={ "user_list" }
                    tabId={ tabId }
                    events={ events }
                ></TreeGrid>
            </div>
        </>
    );
};

export default UserList;
