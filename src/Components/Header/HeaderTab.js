import React, { useState, useRef, useEffect, useContext } from 'react';
import Dashboard from '../Dashboard/Dashboard';
import { Close } from '@carbon/react/icons'

const HeaderTab = () => {

    const [activeTab, setActiveTab] = useState(1);
    const [selectedIndex, setSelectedIndex] = useState(0);

    const [tab, setTab] = useState([
        {
            content: <Dashboard />,
            id: 1,
            label: 'Dashboard',
            isDelted: false,
        }
    ])



    const handleRemoveTab = (idToRemove, index) => {
        const updatedTabs = tab.filter((tab) => tab.id !== idToRemove);
        // const res = updatedTabs.map((data,index)=>data.id=index+1 && data.id!=1)
        setTab(updatedTabs);
        // console.log(idToRemove,"id to remove",index,tab[index].label,updatedTabs,activeTab)
        setActiveTab(index)
    };

    const handleAddTab = () => {
        const newId = Math.max(...tab.map((tab) => tab.id), 0) + 1;
        const maxId = tab.reduce((max, item) => {
            return item.id > max ? item.id : max;
        }, 0);
        // console.log(maxId+1,"id is  ","active",tab.length+1)
        const newTab = { id: (maxId + 1), label: `Tab ${maxId + 1}`, content: `This is the content for Tab ${maxId + 1}`, isDelted: true };
        setTab([...tab, newTab]);
        // console.log(tab.length+1,"test")
        setActiveTab(tab.length + 1)



    }

    // console.log(tab, "ddd", activeTab)
    return (
        <>
            <div style={{ overflowX: 'auto', width: '80%' }}>
                <div style={{ display: 'flex', whiteSpace: 'nowrap' }}>

                    {tab.map((item, index) => {
                        return (
                            <div key={index} style={{ display: 'flex', alignItems: 'center' }} >


                                <div className={activeTab === index + 1 ? "active-tab-new1" : "inactive-tab-new"} onClick={() => { setActiveTab(index + 1) }}>{item.label}</div>
                                {item.isDelted && <div className="close-icon">
                                    <Close size={20} style={{ cursor: 'pointer' }} onClick={() => handleRemoveTab(item.id, index)} />
                                </div>}
                            </div>
                        )
                    })}
                    <button className="button-dashboard" onClick={handleAddTab}>{'add-new-tab'}</button>

                </div>
                <div style={{
                    display: 'flex', flexDirection: 'column', position: 'absolute', overflow: 'auto',
                    height: 'calc(100vh - 48px)', paddingTop: '2rem', paddingBottom: '2rem', marginLeft: '-40px'
                }}>
                    <div>
                        {tab[activeTab - 1]?.content}
                    </div>
                    {/* <div>
                        {tab[activeTab - 1]?.content}
                    </div> */}
                </div>
            </div>
        </>
    )
}
export default HeaderTab;