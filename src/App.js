import React from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';

import PageSimple from './pages/simple';
import Index from './pages/index';
import Document from './pages/document';

import './App.less';

export default function App() {
    return (
        <Router>
            <Switch>
                <Route exact path={`/`} component={Index} />
                <Route path={`/simple`} component={PageSimple} />
                <Route path={`/document`} component={Document} />
            </Switch>
        </Router>
    );
}