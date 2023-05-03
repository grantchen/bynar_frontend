import React, { useState, useRef, useEffect, useContext } from 'react';
import Dashboard from '../Dashboard/Dashboard';
import { Close } from '@carbon/react/icons'
import { TabContext } from '../../sdk/context/TabContext';
import './HeaderTab.scss'
const HeaderTabComponents = () => {

    const { tab, handleAddTab, handleRemoveTab, setStartIndex, setEndIndex, startIndex, endIndex, activeTab, setActiveTab, maxTab, setMaxTab } = useContext(TabContext);
    const [showLeftArrow, setShowLeftArrow] = useState(false);

    const removeTab = (idToRemove, index) => {
        handleRemoveTab(idToRemove, index)
    };

    const addTab = () => {
        handleAddTab()
    }

    return (
        <>
            <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '52px' }}>
                {/* <button className="button-dashboard" onClick={handleAddTab}>{'add-new-tab'}</button> */}
                <div className="box-container" >
                    <div className="tab-new">
                        <p>{'Platform'}</p>
                    </div>
                </div>
                {tab.map((item, index) => {
                    return (
                        <div key={index} className="tab-container" >
                            <div className={activeTab === index + 1 ? "active-tab-new1" : "inactive-tab-new"} onClick={() => { setActiveTab(index + 1) }}>
                                <p>{item.label}</p>
                                {item.isDelted && <div className="close-icon">
                                    <Close size={12} onClick={() => removeTab(item.id, index)} />
                                </div>}
                            </div>
                            {/* {item.isDelted && <div className="close-icon">
                                <Close size={12} onClick={() => removeTab(index + 1)} />
                            </div>} */}
                        </div>
                    )
                })}
                <button className='button-tab' onClick={addTab}>{'Add-new-tab'}</button>
            </div>
        </>
    )
}
export default HeaderTabComponents;