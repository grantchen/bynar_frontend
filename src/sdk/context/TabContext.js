import React, { createContext, useState ,useRef} from "react";
import Dashboard from "../../Components/Dashboard/Dashboard";
import DashboardContainer from "../../Components/Dashboard/DashboardContainer";

const TabContext = createContext();

const TabContextProvider = ({ children }) => {
    
    const [tab, setTab] = useState([
        {
            content: <DashboardContainer />,
            id: 1,
            label: 'Dashboard',
            isDelted: false,
        }
    ])
    const [activeTab, setActiveTab] = useState(1);
    const [startIndex, setStartIndex] = useState(0)
    const [endIndex, setEndIndex] = useState(0)
    const [maxTab, setMaxTab] = useState(0)
    const handleRemoveTab = (idToRemove, index) => {
        const updatedTabs = tab.filter((tab) => tab.id !== idToRemove);
        // const res = updatedTabs.map((data,index)=>data.id=index+1 && data.id!=1)
        setTab(updatedTabs);
        // console.log(idToRemove,"id to remove",index,tab[index].label,updatedTabs,activeTab)
        setActiveTab(index)
    };

    const handleAddTab = () => {
        const maxId = tab.reduce((max, item) => {
            return item.id > max ? item.id : max;
        }, 0);
        // console.log(maxId+1,"id is  ","active",tab.length+1)
        const newTab = { id: (maxId + 1), label: `Tab ${maxId + 1}`, content: `This is the content for Tab ${maxId + 1}`, isDelted: true };
        setTab([...tab, newTab]);
        // console.log(tab.length+1,"test")
        setActiveTab(tab.length + 1)

        if (tab.length >= maxTab && maxTab > 0) {
            setStartIndex(startIndex + 1)
            setEndIndex(endIndex + 1)
        }
    }

    return (
        <TabContext.Provider value={{ tab, setTab,handleAddTab, handleRemoveTab ,activeTab,startIndex,endIndex,setStartIndex,setEndIndex,activeTab, setActiveTab,maxTab,setMaxTab}}>
            {children}
        </TabContext.Provider>
    );
};

export { TabContext, TabContextProvider };
