import React, { useContext, useEffect, useRef } from "react";
import {
    BaseURL, NodeEnv, TabContext,
    useAuth, uuidv4,
} from "../../sdk";
import "./TreeGrid.scss";
import "./TreeGridStandard.scss"

// State: Page or parent row state of loading / rendering its children.
// 0 - not yet loaded, 1 - children are loading, 2 - children are loaded, but not rendered, 3 - children are rendering, 4 - fully rendered.
const rowStateFullyRendered = 4

// has no permission error reason
const hasNoPermissionErrReason = 'NO_PERMISSION'

// get api request url
export function getAPIRequestURL(url) {
    if (!url) {
        return url
    }

    if (url.startsWith('http')) {
        return url
    } else {
        return `${BaseURL}/apprunnerurl${url}`
    }
}

// TreeGrid is the tree grid component
export const TreeGrid = ({ table, config = {}, tabId, className, events = {} }) => {
    const ref = useRef(null);
    const { tab, handleSetTabLoaded, focusTabById, handleRemoveTab } = useContext(TabContext);
    const { treeGridRequest } = useAuth();

    // custom TreeGrid default ajax request
    if (!events.OnCustomAjax) {
        events.OnCustomAjax = function (G, IO, data, func) {
            if (["Data", "Page", "Upload"].indexOf(IO.Name) === -1) return null;

            const tabId = G.Data.customTabId
            treeGridRequest(IO.Url, data, function (res) {
                if (res?.IO?.Result === -1) {
                    // alert message
                    func(0, res)

                    // remove tab if do not have policy
                    closeTabIfHasNoPolicy(tabId, res)
                } else {
                    func(0, res)
                }
            });
            return true;
        }
    }

    // close tab if it has no policy and tab is not loaded
    const closeTabIfHasNoPolicy = (tabId, res) => {
        if (res?.IO?.Result === -1 && res?.IO?.Reason === hasNoPermissionErrReason) {
            if (tab.find((item) => item.id === tabId)?.loaded === false) {
                handleRemoveTab(tabId)
            }
        }
    }

    // set tab loaded and focus
    const setTabLoadedAndFocus = (tabId, grid, row) => {
        // load node and fully rendered
        if (row.Level === -1 && row?.State === rowStateFullyRendered) {
            if (tab.find((item) => item.id === tabId)?.loaded === false) {
                // update tab loaded
                handleSetTabLoaded(tabId)
                // focus tab
                focusTabById(tabId)
            }
        }
    }

    // load tree grid when component is mounted
    useEffect(() => {
        let treeGrid = null;
        const fetchData = () => {
            const defaultConfig = {
                customTabId: tabId, // custom tab id
                Debug: NodeEnv === "production" ? '' : 'error', // check, info, error
                id: `${table}_${uuidv4()}`,
                Cache: 2, // 0 - Never cache; 1 - Component version; 2 - Cache version; 3 - Standard cache
                CacheVersion: 1, // When the value is increased, the files are forced to download.
                Layout: {
                    Url: `/Layouts/${table}.xml`,
                    Cache: 0, // 0 - Never cache
                },
                Data: {
                    Url: `/${table}/data`,
                    Format: 'Json',
                },
                Page: {
                    Url: `/${table}/page`,
                    Format: 'Json',
                },
                Upload: {
                    Url: `/${table}/upload`,
                    Format: 'Json',
                },
            }

            const mergedConfig = { ...defaultConfig, ...config }
            mergedConfig.Data.Url = getAPIRequestURL(mergedConfig.Data.Url)
            mergedConfig.Page.Url = getAPIRequestURL(mergedConfig.Page.Url)
            mergedConfig.Upload.Url = getAPIRequestURL(mergedConfig.Upload.Url)

            // only for debug
            if (mergedConfig.Debug) {
                console.log(mergedConfig)
            }

            // iterate events and call window.TGSetEvent
            Object.keys(events).forEach((key) => {
                window.TGSetEvent(key, mergedConfig.id, events[key])
            })

            // add event on ready
            window.TGAddEvent("OnRenderPageFinish", mergedConfig.id, function (grid, row) {
                setTabLoadedAndFocus(grid.Data.customTabId, grid, row)
            })

            // Called after the root page or child page is fully rendered and ready.
            window.TGAddEvent("OnRenderChildPartFinish", mergedConfig.id, function (grid, row) {
                // The children have preset Expanded='3' Visible='0' AggChildren='1' as defined in SPage default.
                // doc in ChildPageLength
                if (row.AggChildren === 1 && row.Visible === 0 && row.Expanded === 3) {
                    const parentNodeId = row.parentNode.id
                    // skip if row id starts with parent node id
                    if (row.id.startsWith(parentNodeId)) {
                        return
                    }
                    // set full id for sub page row
                    row.id = `${parentNodeId}$${row.id}`
                }
            })

            window.TGAddEvent("OnShowMenu", mergedConfig.id, function (grid, row) {
                window.localStorage.setItem("treeGridMainTag_" + grid.Data.customTabId, "true")
            })

            window.TGAddEvent("OnCloseMenu", mergedConfig.id, function (grid, row) {
                window.localStorage.removeItem("treeGridMainTag_" + grid.Data.customTabId)
            })

            treeGrid = window.TreeGrid(
                mergedConfig,
                ref.current.id,
                {}
            );
        }

        fetchData();

        return () => {
            if (treeGrid) {
                window.TGDelEvent(null, treeGrid.id, null)
                treeGrid.Dispose && treeGrid?.Dispose()
            }
        }
    }, []);

    return (
        <>
            <div className={`tree-grid-wrapper ${className ? className : ''}`}>
                <div
                    ref={ref}
                    id={`treeGridMainTag_${tabId || uuidv4()}`}
                    style={{ width: '100%', height: '100%' }}
                >
                </div>
            </div>
        </>
    );
};
