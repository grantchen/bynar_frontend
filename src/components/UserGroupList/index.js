import React, { useContext, useEffect } from "react";
import "./UserGroupList.scss";
import { TreeGrid } from "../TreeGrid";
import { TabContext } from "../../sdk";

const UserGroupList = ({ tabId }) => {
    const { tab, activeTab } = useContext(TabContext);

    useEffect(() => {
        if (tab[activeTab].id !== tabId) return;

        // before add
        window.Grids.OnCanRowAdd = function (G, par, next) {
            if (G.Editing === 2) return false;
            // Disable adding rows to grouped category
            if (par.Def?.Name === "Group" && par.Def?.CDef === "R" && par.Rows) return false;
            return
        }

        // on add
        window.Grids.OnRowAdd = function (G, row) {
            let par = row.parentNode
            // add child to grouped row, set code to empty
            if (par && par.Def?.Name === "Group" && par.Def?.CDef === "R") {
                row.code = ''
            }
        }

        return () => {
            window.Grids.OnCanRowAdd = null;
            window.Grids.OnRowAdd = null;
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
