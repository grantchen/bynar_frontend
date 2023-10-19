import React, { useContext, useEffect } from "react";
import "./UserGroupList.scss";
import { TreeGrid } from "../TreeGrid";
import { TabContext } from "../../sdk";

const UserGroupList = ({ tabId }) => {
    const { tab, activeTab } = useContext(TabContext);

    useEffect(() => {
        if (tab[activeTab].id !== tabId) return;

        // Called on adding row
        window.Grids.OnCanRowAdd = function (G, par, next) {
            if (G.Editing === 2) return false;
            // Disable adding rows to grouped root row
            if (par.Level === 0 && par.Def?.Name === "Group" && par.Def?.CDef === "R") return false;
            return
        }

        return () => {
            window.Grids.OnCanRowAdd = null;
        }
    }, [tab, activeTab]);

    return (
        <>
            <div className="tree-grid-content">
                <TreeGrid
                    table={ "user_groups" }
                    config={ {
                        Debug: '',
                    } }
                    tabId={ tabId }
                ></TreeGrid>
            </div>
        </>
    );
};

export default UserGroupList;
