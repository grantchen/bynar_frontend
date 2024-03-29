import { TreeGrid } from "../../index";

// TransferList is the transfer list component
const TransferList = ({ tabId }) => {
    // events is an object that contains all the event handlers for the TreeGrid
    const events = {}

    events.OnExpand = function (G, row) {
        if (row.Def.Name === "Node") {
            G.SetAttribute(row, row.parent, "Calculated", 1);
        }
    }

    events.OnRowAdd = function (G, row, col, val) {
        if (row.Def.Name === "Node") {
            G.SetAttribute(row, row.parent, "Calculated", 1);
        }

        // set merged cell value to Parent or Child
        if (row.Def.Name === "Node") {
            row.item_id = row.item_idOrig
        } else if (row.Def.Name === "Data") {
            row.document_id = row.document_idOrig
            row.project_id = row.project_idOrig
        }
    }

    events.OnPasteRow = function (G, row, col, val) {
        if (row.Def.Name === "Node") {
            G.SetAttribute(row, row.parent, "Calculated", 1);
        }
    }

    events.OnGetMenu = function (G, row, col, M) {
        if (row.Fixed || M) return null;
        var I = [], M = { Items: I }, ident = row.Def.Name === "Node" ? " order" : " product";
        I[I.length] = { Name: "Del", Text: (row.Deleted ? "Undelete" : "Delete") + ident };
        I[I.length] = { Name: "Sel", Text: (row.Selected ? "Deselect" : "Select") + ident };
        I[I.length] = { Name: "Cpy", Text: "Copy" + ident };
        if (row.firstChild) I[I.length] = {
            Name: "CpyTree",
            Text: row.Def.Name === "Node" ? "Copy order with products" : "Copy product with items"
        };

        if (row.Def.Name === "Node") {
            I[I.length] = { Name: "AddOrder", Text: "Add new order" };
            I[I.length] = { Name: "InsItem", Text: "Add new product" };
        } else I[I.length] = { Name: "AddItem", Text: "Add new product" };
        if (row.firstChild) I[I.length] = {
            Name: "Exp",
            Text: (row.Expanded ? "Collapse" : "Expand") + (row.Def.Name === "Node" ? " order" : " product")
        };
        if (row.Def.Name === "Node") I[I.length] = {
            Name: "Check",
            Text: window.Get(row, 'X') ? "Uncheck Used" : "Check Used"
        };
        return M;
    }

    events.OnContextMenu = function (G, row, col, N) {
        switch (N) {
            case "Del":
                G.DeleteRow(row);
                break;
            case "Sel":
                G.SelectRow(row);
                break;
            case "Cpy":
                G.CopyRow(row, null, row);
                break;
            case "CpyTree":
                G.CopyRows([row], null, row, 1);
                break;
            case "AddItem":
                G.ActionAddRow();
                break;
            case "InsItem":
                G.ActionAddChildEnd();
                break;
            case "AddOrder":
                G.ActionAddRow();
                break;
            case "Exp":
                if (row.Expanded) G.Collapse(row); else G.Expand(row);
                break;
            case "Check":
                G.SetValue(row, "X", !window.Get(row, 'X'), 1);
                break;
        }
    }

    events.OnDownloadPage = function (G, Row) {
        // G.RecalculateRows(G.Rows.Fix1, 1);
    }

    events.OnRenderPageFinish = function (G) {
        // G.RecalculateRows(G.Rows.Fix1, 1);
    }

    events.OnPageReady = function (G, Row) {
        // G.RecalculateRows(G.Rows.Fix1, 1);
    }

    events.OnLanguageFinish = function (G, code) {
        // var row = G.Rows.Fix3;
        // G.SetValue(row, "C", window.Get(row, window.Get(row, "D") + "Rate"), 1);
    }

    return (
        <>
            <div className="tree-grid-content">
                <TreeGrid
                    table={ "transfers" }
                    tabId={ tabId }
                    events={ events }
                ></TreeGrid>
            </div>
        </>
    );
};

export default TransferList;
