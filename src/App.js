import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import PageSimple from './pages/simple';
import PageIndex from './pages/index';
import PageTransaction from './pages/transaction';

import './App.less';

export default function App() {
    return (
        <Router>
            <Switch>
                <Route exact path={`/`} component={PageIndex} />
                <Route path={`/simple`} component={PageSimple} />
                <Route path={`/transaction`} component={PageTransaction} />
            </Switch>
        </Router>
    );
}