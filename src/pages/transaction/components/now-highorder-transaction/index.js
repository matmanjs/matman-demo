import React, { Component } from 'react';
import { connect } from 'react-redux';

import DisplayTransaction from '../now-display-transaction';

class HighorderTransaction extends Component {
    render() {
        let { isLoaded, list } = this.props;

        return (
            <DisplayTransaction isLoaded={isLoaded} list={list} />
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

export default connect(mapStateToProps)(HighorderTransaction);
