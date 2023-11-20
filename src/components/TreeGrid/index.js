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

// get api request url
export function getAPIRequestURL(url) {
    if (!url) {
        return url
    }

    if (url.startsWith('http')) {
        return url
    } else {
        return `${ BaseURL }/apprunnerurl${ url }`
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
        if (res?.IO?.Result === -1 && res?.IO?.Message === 'do not have policy') {
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
                id: `treeGrid_${ table || uuidv4() }`,
                Cache: 2, // 0 - Never cache; 1 - Component version; 2 - Cache version; 3 - Standard cache
                CacheVersion: 1, // When the value is increased, the files are forced to download.
                Layout: {
                    Url: `/Layouts/${ table }.xml`,
                    Cache: 0, // 0 - Never cache
                },
                Data: {
                    Url: `/${ table }/data`,
                    Format: 'Json',
                },
                Page: {
                    Url: `/${ table }/page`,
                    Format: 'Json',
                },
                Upload: {
                    Url: `/${ table }/upload`,
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

            treeGrid = window.TreeGrid(
                mergedConfig,
                ref.current.id,
                {}
            );

            // iterate events and call window.TGSetEvent
            Object.keys(events).forEach((key) => {
                window.TGSetEvent(key, treeGrid.id, events[key])
            })

            // add event on ready
            window.TGAddEvent("OnRenderPageFinish", treeGrid.id, function (grid, row) {
                setTabLoadedAndFocus(grid.Data.customTabId, grid, row)
            })
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
            <div className={ `tree-grid-wrapper ${ className ? className : '' }` }>
                <div
                    ref={ ref }
                    id={ `treeGridMainTag_${ tabId || uuidv4() }` }
                    style={ { width: '100%', height: '100%' } }
                >
                </div>
            </div>
        </>
    );
};
