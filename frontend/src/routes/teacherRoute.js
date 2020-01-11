import React from 'react';
import { Route, Redirect } from 'react-router-dom';

// JUST ADMINS AND TEACHERS CAN ACCESS THIS ROUTE
export default function TeacherRoute({ component: Component, idToken, paid, ...rest }) {
    return (
        <Route 
            {...rest}
            render={props => {
                if(!paid) {
                    return (
                        <Redirect to={{pathname: '/authenticated/customermessage', state: { from: props.location } }} />
                    )
                } else if(!idToken.claims.isStudent) {
                    return (
                        <Component  idToken={idToken} {...props} />
                    )
                } else {
                    return (
                        <Redirect to={{pathname: '/authenticated/studentarea', state: { from: props.location } }} />
                    )
                }
            }}
        />
    )
}