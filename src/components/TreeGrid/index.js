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
function getAPIRequestURL(url) {
    if (!url) {
        return url
    }

    if (url.startsWith('http')) {
        return url
    } else {
        return `${ BaseURL }/apprunnerurl${ url }`
    }
}

export const TreeGrid = ({ table, config = {}, tabId, className }) => {
    const ref = useRef(null);
    const { handleSetTabLoaded } = useContext(TabContext);
    const { authFetch } = useAuth();

    // request TreeGrid api
    function treeGridRequest(url, param, callback) {
        authFetch(url, {
            method: "POST",
            body: new URLSearchParams(`Data=${ param }`),
        }).then((response) => response.json())
            .then((data) => {
                callback(data)
            });
        return true
    }

    // suggest
    window.Grids.OnAfterValueChanged = window.parseCellSuggestionCallback(window.keySuggest, window.lsSuggestionField)
    // load cell data
    window.LoadCellData = function (url, param, callback) {
        treeGridRequest(url, param, function (res) {
            if (res?.IO?.Result === -1) {
                callback(-1, res.IO.Message);
            } else {
                const data = window.parseItemSuggestionCallBack(window.keySuggest, JSON.stringify(res), window.lsSuggestionField);
                callback(0, data);
            }
        });
    }

    // custom TreeGrid ajax request
    window.Grids.OnCustomAjax = function (G, IO, data, func) {
        if (["Data", "Page", "Upload"].indexOf(IO.Name) === -1) return null;

        treeGridRequest(IO.Url, data, function (res) {
            if (res?.IO?.Result === -1) {
                func(res, res)
            } else {
                func(0, res)
            }
        });
        return true;
    }

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
                Cell: {
                    Script: `LoadCellData('${ getAPIRequestURL(`/${ table }/cell`) }', Data, Func);`,
                    Format: 'Json',
                },
            }

            config = { ...defaultConfig, ...config }
            config.Data.Url = getAPIRequestURL(config.Data.Url)
            config.Page.Url = getAPIRequestURL(config.Page.Url)
            config.Upload.Url = getAPIRequestURL(config.Upload.Url)

            // only for debug
            if (config.Debug) {
                console.log(config)
            }

            treeGrid = window.TreeGrid(
                config,
                ref.current.id,
                {}
            );
            window.Grids.OnReady = function (G) {
                //update tab loaded
                handleSetTabLoaded(G.id.replace('treeGrid_', ''))
            }
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
