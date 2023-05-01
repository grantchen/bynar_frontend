import React, { useState, useRef, useEffect, useContext } from 'react';
import Dashboard from '../Dashboard/Dashboard';
import { Close } from '@carbon/react/icons'
const HeaderTabComponents = () => {

    const [tab, setTab] = useState([
        {
            content: <Dashboard />,
            id: "1",
            label: 'Dashboard',
            isDelted: false,
        }
    ])

    const [activeTab, setActiveTab] = useState(1);

    const handleRemoveTab = (idToRemove) => {
        const updatedTabs = tab.filter((tab) => tab.id !== idToRemove);
        setTab(updatedTabs);
    };

    const handleAddTab = () => {
        const newTab = { id: (tab.length + 1).toString(), label: `Tab ${tab.length + 1}`, content: `This is the content for Tab ${tab.length + 1}`, isDelted: true};
        setTab([...tab, newTab]);

        // console.log(tab, "ddd", newTab)

    }
    return (
        <>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <button className="button-dashboard" onClick={handleAddTab}>{'add-new-tab'}</button>
                {tab.map((item, index) => {
                    return (
                        <div key={index} onClick={() => { setActiveTab(index + 1) }} style={{ display: 'flex' }}>


                            <div className={activeTab === index + 1 ? "active-tab-new1" : "inactive-tab-new"}>{item.tab ?? ('title')}</div>
                            {item.isDelted && <div className="close-icon">
                                <Close size={12} onClick={() => handleRemoveTab(index + 1)} />
                            </div>}
                        </div>
                    )
                })}

            </div>
        </>
    )
}
export default HeaderTabComponents;