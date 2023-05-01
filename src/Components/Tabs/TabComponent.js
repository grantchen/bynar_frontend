import React, { useState, useRef, useEffect, useContext } from 'react';

import {
  Heading,
  Column,
  Grid,
  Tile,
  ModifiedTabs,
  Tab
} from '@carbon/react';
import {Close } from '@carbon/react/icons'
import DashboardContainer from '../Dashboard/DashboardContainer';
import './Tabs.scss'
import { useTranslation } from 'react-i18next';

export const TabComponent=()=>{

   const [activeTab,setActiveTab]=useState(1);

   const {t}=useTranslation();
   
   const [data,setData] =useState(
    [
      {
        component: <DashboardContainer/>,
        id: 1,
        isDelted:false,
      }
    ]
   )
   useEffect(()=>{
    if(activeTab>data.length)
    setActiveTab((activeTab)=>activeTab-1)
  },[data])
  
   const handleRemoveTab=(value)=>{
     var array =[...data.slice(0,value-1),...data.slice(value)]
     setActiveTab(value-1);
    setData(array)
   }


   const addTab=(e)=>{
    e.preventDefault();
    const newTab={
      tab: `${t('item-detail')} ${data[data.length-1].id+1}`,
      component: <div>{t('item-detail')} {data[data.length-1].id+1}</div>,
      id: data[data.length-1].id+1,
      isDelted:true,
    }
    setActiveTab(data.length+1);
    setData([...data,newTab]);
   }
    return(
      <>
        {/* <div className={activeTab ===1?'active-tab-div':'tab-div'}>
          <button className="button-dashboard" onClick={addTab}>{t('add-new-tab')}</button>
          <div style={{display:'flex',overflowY:'auto',whiteSpace:'nowrap',cursor:'pointer'}}>
            {data.map((item,index)=>{
              return(
                <div key={index} onClick={()=>{setActiveTab(index+1)}} style={{display:'flex'}}>

                  
                  <div className={activeTab===index+1?"active-tab-new1":"inactive-tab-new"}>{item.tab ?? t('title')}</div>
                  {item.isDelted && <div className="close-icon">
                    <Close size={12} onClick={()=>handleRemoveTab(index+1)}/>
                    </div>}               
                </div>
              )
            })}
          </div>
         
         
        </div> */}
        <div className={activeTab ===1?'active-tab':'active-tab-new'}>
         {data[activeTab-1]?.component}
       </div>
       <div className={activeTab ===1?'active-tab':'active-tab-new'}>
         {data[activeTab-1]?.component}
       </div>
        
       </>
    )
}
