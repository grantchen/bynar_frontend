import React, { createContext, lazy, useCallback, useEffect, useState, useRef } from "react";
import Dashboard from "../components/Dashboard";
import { useTranslation } from "react-i18next";
import { useAuth } from "./AuthContext";
import { handleActiveTabCfg, uuidv4 } from "./util";

const UserList = lazy(() => import("../components/TreeGrid/Modules/Users/index"));
const InvoiceList = lazy(() => import("../components/TreeGrid/Modules/Invoices/index"));
const GeneralPostingSetupList = lazy(() => import("../components/TreeGrid/Modules/GeneralPostingSetup/index"));
const WarehouseList = lazy(() => import("../components/TreeGrid/Modules/Warehouses/index"));
const OrganizationList = lazy(() => import("../components/TreeGrid/Modules/Organizations/index"));
const UserGroupList = lazy(() => import("../components/TreeGrid/Modules/UserGroups/index"));
const SiteList = lazy(() => import("../components/TreeGrid/Modules/Sites/index"));
const TransferList = lazy(() => import("./../components/TreeGrid/Modules/Transfers/index"));
const SaleList = lazy(() => import("../components/TreeGrid/Modules/Sales/index"));
const PaymentList = lazy(() => import("../components/TreeGrid/Modules/Payments/index"));
const ProcurementList = lazy(() => import("../components/TreeGrid/Modules/Procurements/index"));
const LanguageList = lazy(() => import("../components/TreeGrid/Modules/Languages/index"));

const TabContext = createContext();

// TabContextProvider is used to manage tabs
const TabContextProvider = ({ children }) => {
    // TabComponent is used to render tab content
    const TabComponent = (name, tabId) => {
        switch (name) {
            case "Dashboard":
                return <Dashboard />;
            case "UserList":
                return <UserList tabId={tabId} />;
            case "InvoiceList":
                return <InvoiceList tabId={tabId} />;
            case "GeneralPostingSetupList":
                return <GeneralPostingSetupList tabId={tabId} />;
            case "OrganizationList":
                return <OrganizationList tabId={tabId} />;
            case "SiteList":
                return <SiteList tabId={tabId} />;
            case "TransferList":
                return <TransferList tabId={tabId} />;
            case "UserGroupList":
                return <UserGroupList tabId={tabId} />;
            case "WarehouseList":
                return <WarehouseList tabId={tabId} />;
            case "SaleList":
                return <SaleList tabId={tabId} />
            case "PaymentList":
                return <PaymentList tabId={tabId} />
            case "ProcurementList":
                return <ProcurementList tabId={tabId} />
            case "LanguageList":
                return <LanguageList tabId={tabId} />
            default:
                return null;
        }
    }

    const { t } = useTranslation();
    let ref = useRef([]);
    const [tab, setTab] = useState([
        {
            content: <Dashboard />,
            id: uuidv4(),
            label: t('title'),
            labelKey: 'title',
            canDelete: false,
            name: 'Dashboard',
            loaded: true
        },
    ]);
    const [activeTab, setActiveTab] = useState(0);
    const { user } = useAuth()

    useEffect(() => {
        ref.current = tab;
    }, [tab]);

    // update tab label when language changed
    useEffect(() => {
        setTab(prev => prev.map((val, idx) => {
            return { ...val, label: t(val.labelKey) }
        }))
    }, [user?.languagePreference, t]);

    // handle remove tab
    const handleRemoveTab = useCallback((idToRemove) => {
        const selectedTabId = tab[activeTab]?.id;
        const indexToRemove = tab.findIndex((item) => item.id === idToRemove);
        const updatedTabs = tab.filter((item) => item.id !== idToRemove);
        setTab(updatedTabs);

        if (indexToRemove === activeTab) {
            if (updatedTabs.length === indexToRemove) {
                setActiveTab(indexToRemove - 1);
            } else {
                setActiveTab(indexToRemove);
            }
        } else {
            setActiveTab(updatedTabs.findIndex((item) => item.id === selectedTabId));
        }
    }, [tab, setActiveTab, activeTab, setTab]);

    // set tab loaded
    const handleSetTabLoaded = (tabId) => {
        let tmpTabs = [...ref.current]
        tmpTabs.forEach((item, index) => {
            if (item.id === tabId) {
                let tmpTab = item
                tmpTab.loaded = true
                tmpTabs[index] = tmpTab
            }
        })
        setTab(tmpTabs)
    }

    // handle add tab
    const handleAddTab = (name, labelKey = '', tabType = 'default') => {
        let tabId = uuidv4()
        const newTab = {
            id: tabId,
            label: t(labelKey),
            labelKey: labelKey,
            content: TabComponent(name, tabId),
            canDelete: true,
            name: name,
            loaded: tabType !== "treeGrid"
        };
        setTab([...tab, newTab]);
    };

    // go to tab if tab is already opened, if not, add new tab
    const goToTab = (name, labelKey, tabType) => {
        // find tab by name of tab, if not found, add new tab, if found, set active tab to that tab
        const tabIndexToGo = tab.findIndex((item) => item.name === name);
        if (tabIndexToGo > -1) {
            if (tab[tabIndexToGo].loaded === true) {
                setActiveTab(tabIndexToGo);
                handleActiveTabCfg(tabIndexToGo);
            }
        } else {
            handleAddTab(name, labelKey, tabType);
        }
    }

    // focus tab by id
    const focusTabById = (tabId) => {
        // find tab by id of tab, if found, set active tab to that tab
        const tabs = ref.current
        const tabIndexToGo = tabs.findIndex((item) => item.id === tabId);
        if (tabIndexToGo > -1) {
            if (tabs[tabIndexToGo]) {
                setActiveTab(tabIndexToGo);
            }
        }
    }

    return (
        <TabContext.Provider
            value={{
                tab,
                setTab,
                handleAddTab,
                handleRemoveTab,
                activeTab,
                setActiveTab,
                goToTab,
                handleSetTabLoaded,
                focusTabById,
            }}
        >
            {children}
        </TabContext.Provider>
    );
};

export { TabContext, TabContextProvider };
