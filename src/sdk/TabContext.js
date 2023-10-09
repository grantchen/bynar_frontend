import { Heading } from "@carbon/react";
import React, { createContext, lazy, useCallback, useEffect, useState } from "react";
import DashboardContainer from "./../components/Dashboard/DashboardContainer";
import { useTranslation } from "react-i18next";
import { useAuth } from "./AuthContext";

const UserList = lazy(() => import("./../components/UserList/index"));
const InvoicesTable = lazy(() => import("./../components/InvoicesTable/index"));

const TabContext = createContext();
const EmptyTabName = "EmptyTab";
const EmptyTab = ({ label }) => {
    return (
        <>
            <div
                style={ {
                    width: "100%",
                    height: "60vh",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                } }
            >
                <svg
                    focusable="false"
                    preserveAspectRatio="xMidYMid meet"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    width="200"
                    height="200"
                    viewBox="0 0 32 32"
                    aria-hidden="true"
                >
                    <path
                        d="M25 21c-.7396 0-1.4241.2155-2.0191.5669l-2.0314-2.0314-1.4141 1.4141 2.0314 2.0314c-.3514.595-.5668 1.2795-.5668 2.019 0 2.2056 1.7944 4 4 4 .3557 0 .6943-.0615 1.0228-.1492l-2.4368-2.4368.0004-.0005c-.3621-.3621-.5864-.8621-.5864-1.4136 0-1.103.897-2 2-2 .5515 0 1.0515.2242 1.4136.5864l.0004-.0005 2.4368 2.4368c.0875-.3284.1491-.667.1491-1.0227 0-2.2056-1.7944-4-4-4zM20.9495 12.4644l3.7645-3.7645c.3911.1868.8237.3 1.2861.3 1.6569 0 3-1.3431 3-3s-1.3431-3-3-3-3 1.3431-3 3c0 .4622.1132.8948.2999 1.2859l-3.7645 3.7645 1.4141 1.4141zm5.0505-7.4644c.5514 0 1 .4486 1 1s-.4486 1-1 1-1-.4486-1-1 .4486-1 1-1zM16 12c-2.2092 0-4 1.7908-4 4 0 .7405.215 1.4254.5657 2.0201l-5.2795 5.2799c-.3911-.1868-.8238-.3-1.2861-.3-1.6569 0-3 1.3431-3 3s1.3431 3 3 3 3-1.3431 3-3c0-.4622-.1132-.8948-.2999-1.2858l5.2799-5.2799c.5948.3507 1.2795.5657 2.02.5657 2.2091 0 4-1.7909 4-4s-1.7909-4-4-4zM6 27c-.5514 0-1-.4486-1-1s.4486-1 1-1 1 .4486 1 1-.4486 1-1 1zm10-9c-1.1028 0-2-.8972-2-2s.8972-2 2-2 2 .8972 2 2-.8972 2-2 2zM7 11c.7396 0 1.4241-.2155 2.0191-.5669l2.0311 2.0311 1.4141-1.4141-2.0311-2.0311c.3514-.595.5668-1.2795.5668-2.019 0-2.2056-1.7944-4-4-4-.3557 0-.6943.0615-1.0228.1492l2.4368 2.4368-.0004.0005c.3621.3621.5864.8621.5864 1.4136 0 1.103-.897 2-2 2-.5515 0-1.0515-.2242-1.4136-.5864l-.0004.0005-2.4368-2.4368c-.0875.3284-.1491.667-.1491 1.0227 0 2.2056 1.7944 4 4 4z"></path>
                </svg>
                <Heading>{ label }</Heading>
            </div>
        </>
    );
};

const TabContextProvider = ({ children }) => {
    const { t } = useTranslation();
    const [tab, setTab] = useState([
        {
            content: <DashboardContainer />,
            id: 0,
            label: t('title'),
            labelKey: 'title',
            isDelted: false,
            name: 'Dashboard',
            loaded: true
        },
    ]);
    const [activeTab, setActiveTab] = useState(0);
    const [startIndex, setStartIndex] = useState(0);
    const [endIndex, setEndIndex] = useState(0);
    const [maxTab, setMaxTab] = useState(0);
    const { user } = useAuth()

    const TabComponent = (name,tabId) => {
        switch (name) {
            case "Dashboard":
                return <DashboardContainer />;
            case "Users":
                return <UserList tabId={tabId}/>;
            case "Invoices":
                return <InvoicesTable tabId={tabId}/>;
            default:
                return null;
        }
    }

    useEffect(() => {
        setTab(prev => prev.map((val, idx) => {
            if (val.name === EmptyTabName) {
                const tabNumber = val.label.split(' ')[1]
                return { ...val, label: t('tab') + ' ' + tabNumber }
            }

            return { ...val, label: t(val.labelKey) }
        }))
    }, [user?.languagePreference, t]);

    const handleRemoveTab = useCallback((idToRemove, index) => {
        const selectedTabId = tab[activeTab].id;
        const updatedTabs = tab.filter((tab) => tab.id !== idToRemove);
        setTab(updatedTabs);

        if (index === activeTab) {
            if (updatedTabs.length === index) {
                setActiveTab(index - 1);
            } else {
                setActiveTab(index);
            }
        } else {
            setActiveTab(updatedTabs.findIndex((item) => item.id === selectedTabId));
        }
    }, [tab, setActiveTab, activeTab, setTab]);

    const handleSetTabLoaded = (tabId) => {
        let tmpTabs = [...tab]
        tab.forEach((item,index) => {
            if (item.id === Number(tabId)){
                let tmpTab = item
                tmpTab.loaded = true
                tmpTabs[index] = tmpTab
            }
        })
        setTab(tmpTabs)
    }
    const handleAddTab = (name = EmptyTabName, labelKey = '',tabType = 'default') => {
        const maxId = tab.reduce((max, item) => {
            return item.id > max ? item.id : max;
        }, 0);

        let label;
        let tabId = maxId + 1
        let content = TabComponent(name,tabId);
        if (!content) {
            // use empty tab if no content
            content = <EmptyTab label={ `${ t('tab') } ${ tabId }` } id={ tabId } />
            labelKey = `tab ${ tabId }`
            label = `${ t('tab') } ${ tabId }`;
        } else {
            label = t(labelKey);
        }

        const newTab = {
            id: tabId,
            label: label,
            labelKey: labelKey,
            content: content,
            isDelted: true,
            name: name,
            loaded: tabType === "treeGrid" ? false : true
        };
        setTab([...tab, newTab]);
        if (newTab.loaded) {
            setActiveTab(tab.length);
        }

        if (tab.length >= maxTab && maxTab > 0) {
            setStartIndex(startIndex + 1);
            setEndIndex(endIndex + 1);
        }
    };

    const goToTab = (name, labelKey,tabType) => {
        // find tab by name of tab, if not found, add new tab, if found, set active tab to that tab
        const tabIndexToGo = tab.findIndex((item) => item.name === name);
        if (tabIndexToGo > -1) {
            if (tab[tabIndexToGo].loaded === true){
                setActiveTab(tabIndexToGo);
            }
        } else {
            handleAddTab(name, labelKey,tabType);
        }
    }

    return (
        <TabContext.Provider
            value={ {
                tab,
                setTab,
                handleAddTab,
                handleRemoveTab,
                activeTab,
                startIndex,
                endIndex,
                setStartIndex,
                setEndIndex,
                setActiveTab,
                maxTab,
                setMaxTab,
                goToTab,
                handleSetTabLoaded,
            } }
        >
            { children }
        </TabContext.Provider>
    );
};

export { TabContext, TabContextProvider };
