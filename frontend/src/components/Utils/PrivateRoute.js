import React, { useState, useContext, useEffect } from 'react';
import { Route, Navigate, Outlet } from 'react-router-dom';
import { Content, Theme, Loading } from '@carbon/react';
import { AccountContext } from '../Accounts'

import CarbonHeader from '../CarbonHeader';

export default function PrivateRoute({children}) {
    const { getSession } = useContext(AccountContext);
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [isChecking, setIsChecking] = useState(true)

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
                    <Theme theme="g100">
                        <CarbonHeader />
                    </Theme>
                    <Content style={{ 'backgroundColor': 'var(--cds-layer)' }} >
                    {children}
                    </Content>
                </>
    ) : <Navigate to={'/signin'} />
}
