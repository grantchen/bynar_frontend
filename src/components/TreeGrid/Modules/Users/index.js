import { TreeGrid } from "../../index";

const UserList = ({ tabId }) => {
    const events = {}

    return (
        <>
            <div className="tree-grid-content">
                <TreeGrid
                    table={ "user_list" }
                    tabId={ tabId }
                    events={ events }
                ></TreeGrid>
            </div>
        </>
    );
};

export default UserList;
