import React, { Component } from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';

import Help from './pages/help';
import Index from './pages/index';
import Document from './pages/document';

import './App.less';

export default class App extends Component {
    constructor(...props) {
        super(...props);
    }

    render() {
        return (
            <Router>
                <Switch>
                    <Route exact path={`/`} component={Index} />
                    <Route path={`/help`} component={Help} />
                    <Route path={`/document`} component={Document} />
                </Switch>
            </Router>
        );
    }
}