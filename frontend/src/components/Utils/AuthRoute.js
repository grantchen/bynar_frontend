import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { Content, Theme } from '@carbon/react';

import AuthHeader from '../AuthHeader';

const AuthRoute = ({component: Component, restricted, ...rest}) => {
    return (
        // restricted = false meaning public route
        // restricted = true meaning restricted route
        <Route {...rest} render={props => (
            <>
            <Theme >
                <AuthHeader isSignIn={props.isSignIn} />
            </Theme>
            <Component {...props} />
            </>
        )} />
    );
};

export default AuthRoute;