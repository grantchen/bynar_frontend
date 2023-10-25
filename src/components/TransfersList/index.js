import React, { useContext, useEffect } from "react";
import { TreeGrid } from "../TreeGrid";
import { TabContext } from "../../sdk";

const TransferList = ({ tabId }) => {
    const { tab, activeTab } = useContext(TabContext);

    useEffect(() => {
        if (tab[activeTab].id !== tabId) return;

        var uploadURL = 'http://localhost:8081/test'
        const ADD_KEY = "Added"
        const DELETE_KEY = "Deleted"
        const CHANGE_KEY = "Changed"

        // window.Grids.OnCustomAjax = function (G, IO, data, func) {
        //     try {
        //
        //         if (IO == '' || IO.Url != uploadURL)
        //             return false
        //         let response = handleRestAPI(data)
        //         if (response.IO.Result == 0) {
        //             func(0, JSON.stringify(response))
        //         } else {
        //             func(response.IO.Result, response.IO.Message)
        //         }
        //
        //         return true
        //     } catch (ex) {
        //         console.log(ex)
        //     }
        //     return false
        // }

        // function handleRestAPI(data) {
        //
        //     let obj = JSON.parse(data)
        //     let changes = obj.Changes
        //     let addChangeArr = []
        //     let deleteChangeArr = []
        //     let updateChangeArr = []
        //     for (let i = 0; i < changes.length; i++) {
        //         let changeObj = changes[i]
        //         if (ADD_KEY in changeObj) {
        //             addChangeArr.push(changeObj)
        //         } else if (DELETE_KEY in changeObj) {
        //             deleteChangeArr.push(changeObj)
        //         } else if (CHANGE_KEY in changeObj) {
        //             updateChangeArr.push(changeObj)
        //         }
        //     }
        //
        //     let mapAction = {
        //         "POST": addChangeArr,
        //         "DELETE": deleteChangeArr,
        //         "PUT": updateChangeArr
        //     }
        //     let finalRes = { "IO": { "Message": "", "Result": 0 }, "Changes": [] };
        //     for (let action in mapAction) {
        //         let arrChange = mapAction[action]
        //         if (arrChange.length <= 0) {
        //             continue;
        //         }
        //         let res = updateData(obj, addChangeArr, "POST")
        //         if (res.IO.Result != 0) {
        //             return res;
        //         }
        //         if (res.Changes != null) {
        //             finalRes.Changes = [...finalRes.Changes, ...res.Changes]
        //         }
        //     }
        //     return finalRes
        // }

        // function updateData(baseData, changeDataArr, action) {
        //     let newData = JSON.parse(JSON.stringify(baseData))
        //     newData.Changes = changeDataArr;
        //
        //     let responseTxt = $.ajax({
        //         type: "PUT",
        //         url: uploadURL,
        //         async: false,
        //         data: { Data: JSON.stringify(newData) }
        //     }).responseText
        //     return JSON.parse(responseTxt)
        // }

        window.Grids.OnExpand = function (G, row) {
            if (row.Def.Name == "Node") {
                G.SetAttribute(row, row.parent, "Calculated", 1);
            }
        }

        window.Grids.OnRowAdd = function (G, row, col, val) {

            if (row.Def.Name == "Node") {
                G.SetAttribute(row, row.parent, "Calculated", 1);
            }
        }

        window.Grids.OnPasteRow = function (G, row, col, val) {

            if (row.Def.Name == "Node") {
                G.SetAttribute(row, row.parent, "Calculated", 1);
            }
        }

        window.Grids.OnGetMenu = function (G, row, col, M) {
            if (row.Fixed || M) return null;
            var I = [], M = { Items: I }, ident = row.Def.Name == "Node" ? " order" : " product";
            I[I.length] = { Name: "Del", Text: (row.Deleted ? "Undelete" : "Delete") + ident };
            I[I.length] = { Name: "Sel", Text: (row.Selected ? "Deselect" : "Select") + ident };
            I[I.length] = { Name: "Cpy", Text: "Copy" + ident };
            if (row.firstChild) I[I.length] = { Name: "CpyTree", Text: row.Def.Name == "Node" ? "Copy order with products" : "Copy product with items" };

            if (row.Def.Name == "Node") {
                I[I.length] = { Name: "AddOrder", Text: "Add new order" };
                I[I.length] = { Name: "InsItem", Text: "Add new product" };
            }
            else I[I.length] = { Name: "AddItem", Text: "Add new product" };
            if (row.firstChild) I[I.length] = { Name: "Exp", Text: (row.Expanded ? "Collapse" : "Expand") + (row.Def.Name == "Node" ? " order" : " product") };
            if (row.Def.Name == "Node") I[I.length] = { Name: "Check", Text: window.Get(row, 'X') ? "Uncheck Used" : "Check Used" };
            return M;
        }

        window.Grids.OnContextMenu = function (G, row, col, N) {
            switch (N) {
                case "Del": G.DeleteRow(row); break;
                case "Sel": G.SelectRow(row); break;
                case "Cpy": G.CopyRow(row, null, row); break;
                case "CpyTree": G.CopyRows([row], null, row, 1); break;
                case "AddItem": G.ActionAddRow(); break;
                case "InsItem": G.ActionAddChildEnd(); break;
                case "AddOrder": G.ActionAddRow(); break;
                case "Exp": if (row.Expanded) G.Collapse(row); else G.Expand(row); break;
                case "Check": G.SetValue(row, "X", !window.Get(row, 'X'), 1); break;
            }
        }

        window.Grids.OnDownloadPage = function (G, Row) {
            // G.RecalculateRows(G.Rows.Fix1, 1);
        }

        window.Grids.OnRenderPageFinish = function (G) {
            // G.RecalculateRows(G.Rows.Fix1, 1);
        }

        window.Grids.OnPageReady = function (G, Row) {
            // G.RecalculateRows(G.Rows.Fix1, 1);
        }

        window.Grids.OnLanguageFinish = function (G, code) {
            // var row = G.Rows.Fix3;
            // G.SetValue(row, "C", window.Get(row, window.Get(row, "D") + "Rate"), 1);
        }

        return () => {
            window.Grids.OnExpand = null;
            window.Grids.OnRowAdd = null;
            window.Grids.OnPasteRow = null;
            window.Grids.OnGetMenu = null;
            window.Grids.OnContextMenu = null;
            window.Grids.OnDownloadPage = null;
            window.Grids.OnRenderPageFinish = null;
            window.Grids.OnPageReady = null;
            window.Grids.OnLanguageFinish = null;
        }
    }, [tab, activeTab]);

    return (
        <>
            <div className="tree-grid-content">
                <TreeGrid
                    table={ "transfers" }
                    tabId={ tabId }
                ></TreeGrid>
            </div>
        </>
    );
};

export default TransferList;
