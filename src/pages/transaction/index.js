import React, { Component } from 'react';
import { connect } from 'react-redux';

import Transaction from './components/now-highorder-transaction';

import { loadFlow } from './data/now-data-transaction';

import './index.less';

class PageTransaction extends Component {
    componentDidMount() {
        this.props.loadFlow();
    }

    render() {
        return (
            <div className="page-transaction">
                <Transaction />
            </div>
        );
    }
}

function mapStateToProps(state) {
    let { transactionInfo } = state;

    return {
        isLoaded: transactionInfo.isLoaded,
        list: transactionInfo.list
    };
}

function mapDispatchToProps(dispatch) {
    return {
        loadFlow() {
            return dispatch(loadFlow());
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(PageTransaction);

