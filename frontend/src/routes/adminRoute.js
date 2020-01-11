import React from 'react';
import { Route, Redirect } from 'react-router-dom';

// JUST ADMINS CAN ACCESS THIS ROUTES
export default function AdminRoute({component: Component, idToken, ...rest}) {
    return (
        <Route
            {...rest}
            render={props => {
                if(idToken.claims.isAdmin) {
                    return (
                        <Component idToken={idToken} {...props} />
                    )
                } else if(idToken.claims.isTeacher) {
                    return (
                        <Redirect to={{pathname: '/authenticated/mainscreen', state: { from: props.location } }} />
                    )
                } else if(idToken.claims.isStudent) {
                    return (
                        <Redirect to={{pathname: '/authenticated/studentarea', state: { from: props.location } }} />
                    )
                }
            }}
        />
    )
}