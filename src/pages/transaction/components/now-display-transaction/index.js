import React, { Component } from 'react';

import TransactionList from './transaction-list';
import TransactionEmpty from './transaction-empty';

import './index.less';

export default class DisplayTransaction extends Component {
  render() {
    const { isLoaded, list } = this.props;

    if (!isLoaded) {
      return null;
    }

    return (
            <div className="display-transaction">
                {
                    list.length ? <TransactionList list={list} /> : <TransactionEmpty wording={'暂无流水记录'} />
                }
            </div>
    );
  };
}
