import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import Home from './pages/Home';
import NotFoundPage from './pages/NotFoundPage';
import Terms from './pages/Terms';

import CheckLoginRoute from './routes/checkLoginRoute';
import PrivateRoute from './routes';

ReactDOM.render(
    <BrowserRouter>
        <Switch>
            <Route exact path="/" component={Home}/>
            <CheckLoginRoute path="/login" component={Login}/>
            <Route path="/signup" component={Signup}/>
            <Route path="/forgotpassword" component={ForgotPassword}/>
            <Route path="/terms" component={Terms}/>
            <PrivateRoute path="/authenticated" />
            <Route component={NotFoundPage} />
        </Switch>
    </BrowserRouter>
, document.getElementById('root'));
