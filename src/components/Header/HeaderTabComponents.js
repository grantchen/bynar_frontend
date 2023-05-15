import React, { useState, useContext } from 'react';
import { Close } from '@carbon/react/icons'
import { TabContext } from '../../sdk';
import './HeaderTab.scss'
import { useTranslation } from 'react-i18next';
const HeaderTabComponents = ({onClickSideNavExpand}) => {

    const {t}=useTranslation();
    const { tab, handleAddTab, handleRemoveTab, activeTab, setActiveTab, } = useContext(TabContext);

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
                        <p>{t('Platform')}</p>
                    </div>
                </div>
                {tab.map((item, index) => {
                    return (
                        <div key={index} className="tab-container" >
                            <div className={activeTab === index + 1 ? "active-tab-new1" : "inactive-tab-new"} onClick={() => { 
                                setActiveTab(index)
                                onClickSideNavExpand()
                                 }}>
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
                <button className='button-tab' onClick={addTab}>{t('add-new-tab')}</button>
            </div>
        </>
    )
}
export default HeaderTabComponents;