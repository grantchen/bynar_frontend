import React, { useState, useRef, useEffect, useContext ,useLayoutEffect} from 'react';
import Dashboard from '../Dashboard/Dashboard';
import { Close } from '@carbon/react/icons'
import { Button } from '@carbon/react';
import './HeaderTab.scss'
import { TabContext } from '../../sdk/context/TabContext';

const HeaderTab = () => {

    const { tab, handleAddTab, handleRemoveTab, setStartIndex, setEndIndex, startIndex, endIndex, activeTab, setActiveTab, maxTab, setMaxTab } = useContext(TabContext);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(false);
    const carouselRef = useRef(null);
    const tabRef = useRef(null);


    const handleLeftScroll = () => {

        if (startIndex > 0) {
            setStartIndex(startIndex - 1);
            setEndIndex(endIndex - 1);
            if (tab.length > maxTab) {
                setShowRightArrow(true)
            }
            else {
                setShowRightArrow(false)
            }
        }
        if (startIndex == 0) {
            setShowLeftArrow(false)
        }
    };

    const handleRightScroll = () => {

        const l = tab.slice(startIndex + 1, endIndex + 1).length;
        if (l < maxTab) {
            setShowRightArrow(false)
            setShowLeftArrow(true)
        }
        else {
            setStartIndex(startIndex + 1)
            setEndIndex(endIndex + 1)
        }
    };

    const removeTab = (idToRemove, index) => {
        handleRemoveTab(idToRemove, index)
    };

    const addTab = () => {
        handleAddTab()
    }

    useEffect(() => {
        setShowLeftArrow(startIndex > 0 ? true : false);
        setShowRightArrow(tab.length > maxTab && maxTab > 0 ? true : false)
    }, [tab]);

   

    const handleWindowSizeChange = () => {
        const width = window.innerWidth - 360;     
        const res = (width - 150) / 130;
        if (res < 0) {
            setMaxTab(7);
            setEndIndex(7);
        }
        else {
            setMaxTab(Math.floor(res));
            setEndIndex(Math.floor(res));
        }
    };

    useEffect(() => {
        handleWindowSizeChange()

    }, []);

    

    return (
        <>
            <div className='tab' ref={tabRef}>
                {showLeftArrow && startIndex > 0 ? (
                    <Button className="left-arrow" onClick={handleLeftScroll}>
                        <img src={'../image/left-arrow.svg'} style={{ width: '15px', height: '15px' }} alt="left arrow" />
                    </Button>
                ):(
                    <div style={{width:'40x'}}></div>
                )}

                <div style={{ overflowX: 'hidden'}} ref={carouselRef}>
                    <div style={{ display: 'flex', whiteSpace: 'nowrap'}} >

                        {tab.slice(startIndex, endIndex).map((item, index) => {
                            return (
                                <div key={index} className='tabs'>
                                    <div className={activeTab === index + 1 ? "active-tab-new1" : "inactive-tab-new"} onClick={() => { setActiveTab(index + 1) }}>
                                        <p>{item.label}</p>
                                    </div>
                                    {item.isDelted ?( <div className="close-icon">
                                        <Close size={20} style={{ cursor: 'pointer' }} onClick={() => removeTab(item.id, index)} />
                                    </div>):(
                                        <div style={{width:'20px'}}></div>
                                    )}
                                </div>
                            )
                        })}
                        <button className='button-tab' onClick={addTab}>{'Add-new-tab'}</button>
                    </div>
                </div>
                {showRightArrow ?(
                    <Button className="right-arrow" onClick={handleRightScroll}>
                        <img src={'../image/right-arrow.svg'} style={{ width: '12px', height: '12px' }} alt="right arrow" />
                    </Button>
                ):(
                    <div style={{width:'40px'}}></div>
                )}
            </div>
        </>
    )
}
export default HeaderTab;