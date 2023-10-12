import React from "react";
import "./GeneralPostingSetup.scss";
import { TreeGrid } from "../TreeGrid";

const GeneralPostingSetup = ({ tabId }) => {
    return (
        <>
            <TreeGrid
                table={ "general_posting_setup" }
                config={ {
                    Debug: '',
                } }
                tabId={ tabId }
            ></TreeGrid>
        </>
    );
};

export default GeneralPostingSetup;
