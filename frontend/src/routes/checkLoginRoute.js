import React, { useEffect, useState } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { loadFirebase } from '../services/db';

// VERIFY IF A USER IS ALREADY LOGGED
export default function CheckLoginRoute({ component: Component, ...rest }) {
    const [authState, setAuthState] = useState(null)

    useEffect(() => {
        let willMount = true;

        loadFirebase().auth().onAuthStateChanged((user) => {
        
            if(user) {

                user.getIdTokenResult().then(idTokenResult => {
                    
                    if(willMount) {
                        setAuthState({isAuth: true, claims: idTokenResult.claims})
                    }

                })

            } else {

                if(willMount) {
                    setAuthState({isAuth: false})
                }
                
            }
        })

        return () => willMount = false
    }, [])

    return (
        <Route 
            {...rest}
            render={props => {
                if(authState !== null) {
                    if(!authState.isAuth) {
                        return (
                            <Component {...props} />
                        )
                    } else if(authState.isAuth && authState.claims.isStudent) {
                        return (
                            <Redirect to={{pathname: '/authenticated/studentarea', state: { from: props.location } }} />
                        )
                    } else if(authState.isAuth && !authState.claims.isStudent) {
                        return (
                            <Redirect to={{pathname: '/authenticated/mainscreen', state: { from: props.location } }} />
                        )
                    }
                }
            }}
        />
    )
}