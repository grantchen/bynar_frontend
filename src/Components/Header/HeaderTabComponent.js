import { pkg } from '@carbon/ibm-products';
import { ModifiedTabs } from '@carbon/ibm-products';
import './HeaderTab.scss'
import Dashboard from '../Dashboard/Dashboard';
import { useState } from 'react';
pkg.component.ModifiedTabs = true

const HeaderTabComponent = () => {
    const [tab, setTab] = useState([
        {
            content: <Dashboard />,
            id: "1",
            label: 'Dashboard',
            isDelted:false,
        }
    ])

    const handleRemoveTab = (idToRemove) => {
        const updatedTabs = tab.filter((tab) => tab.id !== idToRemove);
        setTab(updatedTabs);
    };

    const handleAddTab = () => {
        // const newTab={
        //     // tab: `${t('item-detail')} ${data[data.length-1].id+1}`,
        //     component: <div>{t('item-detail')} {data[data.length-1].id+1}</div>,
        //     id: (tab.length + 1),
        //     isDelted:true,
        //     label: `Tab ${tab.length + 1}`,
        //   }
        const newTab = { id: (tab.length + 1).toString(), label: `Tab ${tab.length + 1}`, content: `This is the content for Tab ${tab.length + 1}`,isDelted:false };
        setTab([...tab, newTab]);

        // console.log(tab, "ddd", newTab)

    }

    return (
        <div className='tab'>
            <div
                className='header-tab'
            >
                <ModifiedTabs
                    className="modified-tabs"
                    // newTabContent={<div>Your new tab is being prepared...</div>}
                    newTabLabel="Add new tab"
                    onCloseTab={handleRemoveTab}
                    onNewTab={handleAddTab}
                    tabs={[
                        {
                            content: <Dashboard />,
                            id: "1",
                            label: 'Dashboard'
                        }
                    ]}
                />
            </div>
        </div>
    )
}
export default HeaderTabComponent;