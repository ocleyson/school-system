import React, {useState, useEffect} from 'react';
import { Route, Redirect} from 'react-router-dom';
import App from '../components/App';
import { loadFirebase } from '../services/db';
import api from '../services/api';

import SetGrades from '../pages/SetGrades';
import Subjects from '../pages/Subjects';
import StudentArea from '../pages/StudentArea';
import MainScreen from '../pages/MainScreen';
import SettingsSchool from '../pages/SettingsSchool';
import SettingsClasses from '../pages/SettingsClasses';
import SettingsPeriods from '../pages/SettingsPeriods';
import SettingsSubjects from '../pages/SettingsSubjects';
import SettingsChangeSubjects from '../pages/SettingsChangeSubjects';
import SettingsStudents from '../pages/SettingsStudents';
import SettingsStudentsState from '../pages/SettingsStudentsState';
import SettingsChangePeriods from '../pages/SettingsChangePeriods';
import ChangePassword from '../pages/ChangePassword';
import ChangeEmail from '../pages/ChangeEmail';
import ChangeCreditCard from '../pages/ChangeCreditCard';
import CustomerBlockPage from '../pages/CustomerBlockPage';

import AdminRoute from './adminRoute';
import TeacherRoute from './teacherRoute';
import AdminAndStudentRoute from './adminAndStudentRoute';

// PRIVATE ROUTES
export default function PrivateRoute({...rest}) {
    
    const [authState, setAuthState] = useState(null)

    useEffect(() => {
        let willMount = true;

        loadFirebase().auth().onAuthStateChanged((user) => {
        
            if(user) {

                user.getIdTokenResult().then(idTokenResult => {
                    
                    api.get('/checksubscription', {
                        headers: {
                            authorization: idTokenResult.token
                        }
                    }).then(res => {
                        
                        var paid = res.data.subscription.status === 'active' ? true : false

                        if(willMount) {
                            setAuthState({isAuth: true, claims: idTokenResult.claims, idToken: idTokenResult, paid})
                        }
                    })

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
                    return (
                        authState.isAuth ? (
                            <App idToken={authState.idToken}>
                                {/*JUST ADMINS AND TEACHERS CAN ACCESS THESE ROUTES*/}
                                <TeacherRoute idToken={authState.idToken} paid={authState.paid} path={`${props.match.path}/mainscreen`} component={MainScreen}/>

                                <TeacherRoute idToken={authState.idToken} paid={authState.paid} path={`${props.match.path}/setgrades`} component={SetGrades}/>
                                
                                <TeacherRoute idToken={authState.idToken} paid={authState.paid} path={`${props.match.path}/subjects`} component={Subjects}/>

                                {/*ADMINS, TEACHERS AND STUDENTS CAN ACCESS THIS ROUTE*/}
                                <Route path={`${props.match.path}/studentarea`} render={routeProps => <StudentArea idToken={authState.idToken} {...routeProps} />} />

                                <Route path={`${props.match.path}/customermessage`} render={routeProps => <CustomerBlockPage idToken={authState.idToken} {...routeProps} />} />

                                {/*JUST ADMINS AND STUDENTS CAN ACCESS THESE ROUTES*/}
                                <AdminAndStudentRoute idToken={authState.idToken} path={`${props.match.path}/changepassword`} component={ChangePassword} />

                                <AdminAndStudentRoute idToken={authState.idToken} path={`${props.match.path}/changeemail`} component={ChangeEmail} />

                                {/*JUST ADMINS CAN ACCESS THESE ROUTES*/}
                                <AdminRoute idToken={authState.idToken} path={`${props.match.path}/settings/school`} component={SettingsSchool} />

                                <AdminRoute idToken={authState.idToken} path={`${props.match.path}/settings/classes`} component={SettingsClasses} />

                                <AdminRoute idToken={authState.idToken} path={`${props.match.path}/settings/periods`} component={SettingsPeriods} />

                                <AdminRoute idToken={authState.idToken} path={`${props.match.path}/settings/changeperiods`} component={SettingsChangePeriods} />

                                <AdminRoute idToken={authState.idToken} path={`${props.match.path}/settings/subjects`} component={SettingsSubjects} />

                                <AdminRoute idToken={authState.idToken} path={`${props.match.path}/settings/changesubjects`} component={SettingsChangeSubjects} />

                                <AdminRoute idToken={authState.idToken} path={`${props.match.path}/settings/students`} component={SettingsStudents} />

                                <AdminRoute idToken={authState.idToken} path={`${props.match.path}/settings/studentsstate`} component={SettingsStudentsState} />

                                <AdminRoute idToken={authState.idToken} path={`${props.match.path}/settings/changecreditcard`} component={ChangeCreditCard} />

                            </App>
                        ) : (
                            <Redirect to={{pathname: '/login', state: { from: props.location } }} />
                        )
                    )
                }
            }}
        />
    )
}