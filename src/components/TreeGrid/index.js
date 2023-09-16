import React, { useEffect, useRef } from "react";
import {
  WebStaticBaseURL,
  BaseURL,
  useAuth, uuidv4,
} from "../../sdk";
import { InlineLoading } from "@carbon/react";
import "./TreeGrid.scss";

// get web static source url
function getWebStaticSourceURL(url) {
  if (!url) {
    return url
  }

  if (url.startsWith('http')) {
    return url
  } else {
    return `${ WebStaticBaseURL }/static${ url }`
  }
}

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

export const TreeGrid = ({ table, config = {} }) => {
  let treeGrid = null;
  const ref = useRef(null);

  const { getAuthorizationToken } = useAuth()

  useEffect(() => {
    const fetchData = async () => {
      const token = await getAuthorizationToken()
      if (token) {
        const defaultConfig = {
          Debug: '', // check, info
          id: `treeGrid_${uuidv4()}`,
          Layout: { Url: `/${ table }.xml` },
          Data: {
            Url: `/${ table }/data`,
            Format: 'Json',
            Header: {
              Authorization: token,
            }
          },
          Page: {
            Url: `/${ table }/page`,
            Format: 'Json',
            Header: {
              Authorization: token,
            }
          },
          Upload: {
            Url: `/${ table }/upload`,
            Format: 'Json',
            Header: {
              Authorization: token,
            }
          },
        }

        config = { ...defaultConfig, ...config }
        config.Layout.Url = getWebStaticSourceURL(config.Layout.Url)
        config.Data.Url = getAPIRequestURL(config.Data.Url)
        config.Page.Url = getAPIRequestURL(config.Page.Url)
        config.Upload.Url = getAPIRequestURL(config.Upload.Url)

        // only for debug
        if (config.Debug) {
          console.log(token)
          console.log(config)
        }

        treeGrid = window.TreeGrid(
          config,
          ref.current.id,
          { Component: this }
        );
      }
    }

    fetchData();

    return () => {
      treeGrid?.Dispose()
    }
  }, []);

  return (
    <>
      <div
          ref={ref}
          id={ `treeGridMainTag_${uuidv4()}` }
          style={ { width: '100%', height: '100%' } }
      >
        <div style={ { display: "flex" } }>
          <InlineLoading />
        </div>
      </div>
    </>
  );
};
