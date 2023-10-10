import React from "react";
import "./GeneralPostingSetup.scss";
import { TreeGrid } from "../TreeGrid";

const GeneralPostingSetup = ({ tabId }) => {
    return (
        <>
            <div className="general_posting_setup" style={{ height: '400px' }}>
                <TreeGrid
                    table={"general_posting_setup"}
                    config={{
                        Debug: '',
                    }}
                    tabId={tabId}
                ></TreeGrid>
            </div>
        </>
    );
};

export default GeneralPostingSetup;
