import React, { useState, useContext, useEffect } from 'react';
import { Route, Navigate, Outlet } from 'react-router-dom';
import { Content, Theme, Loading } from '@carbon/react';
import { AccountContext } from '../Accounts'
import DynamicNotifications from './DynamicNotifications';
import { useSelector } from 'react-redux';

import CarbonHeader from '../CarbonHeader';

export default function PrivateRoute({children}) {
    const { getSession } = useContext(AccountContext);
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [isChecking, setIsChecking] = useState(true)
    const theme = useSelector(state => state.appState.theme);

    const isAuth = async () => {
        getSession().then((session) => {
            if (session) {
                setIsLoggedIn(true);
            }
            setIsChecking(false);
        }).catch(() => {
            setIsChecking(false);
        });
    }

    useEffect(() => {
        isAuth()
    }, [isLoggedIn])

    if(isChecking) return <><Loading style={{'maxWidth': '70px', 'maxHeight': '70px'}} /></>;
    

    return isLoggedIn ? (
        <>
                    <Theme theme={(theme == 'dark' ? "g100" : "white")}>
                        <CarbonHeader />
                        <div className='bynar-backgroud-wrapper' ></div>
                    <Content className='bynar-content-container' >
                      
                    <DynamicNotifications/>
                    
                    
                    {children}
                    </Content>
                    </Theme>
                </>
    ) : <Navigate to={'/signin'} />
}
