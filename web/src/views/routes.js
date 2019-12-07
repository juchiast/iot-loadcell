import React from 'react';
import { Switch, Route, Router } from 'react-router-dom';
import history from '../services/history';
import Dashboard from './pages/Dashboard';
import Statistic from './pages/Statistic';

export default function Routes() {
    return (
        <Switch history={history}>
            <Route path="/" exact component={Dashboard} />
            <Route path="/dashboard" exact component={Dashboard} />
            <Route path="/statistic" component={Statistic} />
            <Route component={Dashboard} />
        </Switch>
    );
}
