import { TreeGrid } from "../../index";

// UserList is the user list component
const UserList = ({ tabId }) => {
    // events is an object that contains all the event handlers for the TreeGrid
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
