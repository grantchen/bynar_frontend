import React from "react";
import "./GeneralPostingSetup.scss";
import { TreeGrid } from "../TreeGrid";

const GeneralPostingSetup = () => {
    return (
        <>
            <div className="general_posting_setup" style={{ height: '400px' }}>
                <TreeGrid
                    table={"general_posting_setup"}
                    config={{
                        Debug: '',
                    }}
                ></TreeGrid>
            </div>
        </>
    );
};

export default GeneralPostingSetup;
