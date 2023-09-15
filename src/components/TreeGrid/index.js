import React, { useEffect } from "react";
import {
  WebStaticBaseURL,
  BaseURL,
  useAuth,
} from "../../sdk";
import { InlineLoading } from "@carbon/react";

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
  const mainTagId = `mainTag${ table }`;
  const treeGridTagId = `tree${ table }`;

  const { getAuthorizationToken } = useAuth()

  useEffect(() => {
    const fetchData = async () => {
      const token = await getAuthorizationToken()
      if (token) {
        const defaultConfig = {
          Debug: '', // check, info
          id: treeGridTagId,
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
          mainTagId,
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
        id={ mainTagId }
        style={ { width: '100%', height: '100%' } }
      >
        <div style={ { display: "flex" } }>
          <InlineLoading />
        </div>
      </div>
    </>
  );
};
