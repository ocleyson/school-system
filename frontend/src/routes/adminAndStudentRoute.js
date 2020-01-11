import React from 'react';
import { Route, Redirect } from 'react-router-dom';

// JUST ADMINS AND STUDENTS CAN ACCESS THIS ROUTE
export default function AdminAndStudentRoute({ component: Component, idToken, ...rest }) {
    return (
        <Route 
            {...rest}
            render={props => {
                if(!idToken.claims.isTeacher) {
                    return (
                        <Component idToken={idToken} {...props} />
                    )
                } else {
                    return (
                        <Redirect to={{pathname: '/authenticated/mainscreen', state: { from: props.location } }} />
                    )
                }
            }}
        />
    )
}