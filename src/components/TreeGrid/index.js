import React, { forwardRef, useContext, useEffect, useRef } from "react";
import {
    BaseURL, NodeEnv, TabContext,
    useAuth, uuidv4,
} from "../../sdk";
import debounce from "lodash/debounce";
import "./TreeGrid.scss";
import Frame, { useFrame } from 'react-frame-component';

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

export const TreeGrid = forwardRef(({ table, config, tabId, className, iframeDidMount }, ref) => {
    const content = `
<!DOCTYPE html>
<html>
    <head>
        <script src="/Grid/GridED.js"></script>
        <script src="/Layouts/cell_url.js?v=1"></script>
        <link rel="stylesheet" href="/Grid/Styles/Custom/index.css">
    </head>

    <body>
        <div id="mountHere"></div>
    </body>
</html>    
    `
    return (
        <Frame
            initialContent={ content }
            mountTarget='#mountHere'
            ref={ ref }
            style={ { width: '100%', height: '100%' } }
            contentDidMount={ iframeDidMount }
        >
            <TreeGridE
                table={ table }
                tabId={ tabId }
                config={ config }
                className={ className }
            ></TreeGridE>
        </Frame>
    )
})

const TreeGridE = ({ table, config = {}, tabId, className }) => {
    const { window } = useFrame();
    const ref = useRef(null);
    const { handleSetTabLoaded } = useContext(TabContext);
    const { authFetch } = useAuth();

    // request TreeGrid api
    window.treeGridRequest ||= function (url, param, callback) {
        authFetch(url, {
            method: "POST",
            body: new URLSearchParams(`Data=${ param }`),
        }).then((response) => response.json())
            .then((data) => {
                callback(data)
            });
        return true
    }

    // load cell data
    window.LoadCellData ||= debounce(function (url, param, callback) {
        window.treeGridRequest(url, param, function (res) {
            if (res?.IO?.Result === -1) {
                // alert message
                callback(0, res);
            } else {
                const data = window.parseItemSuggestionCallBack(window.keySuggest, JSON.stringify(res), window.lsSuggestionField);
                callback(0, data);
            }
        });
    }, 300)

    // custom TreeGrid ajax request
    window.Grids.OnCustomAjax ||= function (G, IO, data, func) {
        if (["Data", "Page", "Upload"].indexOf(IO.Name) === -1) return null;

        window.treeGridRequest(IO.Url, data, function (res) {
            if (res?.IO?.Result === -1) {
                // alert message
                func(0, res)
            } else {
                func(0, res)
            }
        });
        return true;
    }

    window.Grids.OnReady = function (G) {
        // update tab loaded
        handleSetTabLoaded(G.id.replace('treeGrid_', ''))
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
                "treeGridMainTag",
                {}
            );
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
                    id={ `treeGridMainTag` }
                    className={ "tree-grid-main-tag" }
                    style={ { width: '100%', height: '100%' } }
                >
                </div>
            </div>
        </>
    );
};
