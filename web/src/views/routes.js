import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';

export default function Routes() {
    return (
        <Switch>
            <Route path="/" exact component={Dashboard} />
            {/* redirect user to SignIn page if route does not exist and user is not authenticated */}
            {/* <Route component={SignIn} /> */}
        </Switch>
    );
}
