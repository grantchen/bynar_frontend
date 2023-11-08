import React, { useContext, useEffect, useRef } from "react";
import {
    BaseURL, NodeEnv, TabContext,
    useAuth, uuidv4,
} from "../../sdk";
import "./TreeGrid.scss";
import "./TreeGridBorders.scss"
import "./TreeGridBlack.scss"
import "./TreeGridGradient.scss"
import "./TreeGridLight.scss"
import "./TreeGridMaterial.scss"
import "./TreeGridOffice.scss"
import "./TreeGridRelief.scss"
import "./TreeGridStandard.scss"
import "./TreeGridTurg.scss"
import "./TreeGridWhite.scss"
import "./TreeGridQuery.scss"
import "./TreeGridExtJS.scss"
import "./TreeGridSharp.scss"
import "./TreeGridRound.scss"
import "./TreeGridColors.scss"

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
    const { handleSetTabLoaded } = useContext(TabContext);
    const { treeGridRequest } = useAuth();

    // custom TreeGrid default ajax request
    if (!events.OnCustomAjax) {
        events.OnCustomAjax = function (G, IO, data, func) {
            if (["Data", "Page", "Upload"].indexOf(IO.Name) === -1) return null;

            treeGridRequest(IO.Url, data, function (res) {
                if (res?.IO?.Result === -1) {
                    // alert message
                    func(0, res)
                } else {
                    func(0, res)
                }
            });
            return true;
        }
    }

    // load tree grid when component is mounted
    useEffect(() => {
        let treeGrid = null;
        const fetchData = () => {
            const defaultConfig = {
                Debug: NodeEnv === "production" ? '' : 'error', // check, info, error
                id: `treeGrid_${ tabId || uuidv4() }`,
                Layout: { Url: `/Layouts/${ table }.xml` },
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
            window.TGAddEvent("OnReady", treeGrid.id, function (G) {
                // update tab loaded
                handleSetTabLoaded(G.id.replace('treeGrid_', ''))
            })
        }

        fetchData();

        return () => {
            treeGrid?.Dispose && treeGrid?.Dispose()
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
