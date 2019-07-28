import React, { Component } from 'react';
import WithdrawWalletTips from './withdraw-wallet-tips';
import WithdrawQuotas from './withdraw-quotas';
import WithdrawBalanceTips from './withdraw-balance-tips';
import WithdrawSubmit from './withdraw-submit';

import './index.less';

export default class DisplayWithdraw extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            // 最大允许提现金额，提现金额不能够超过用户的红包余额
            maxWithdrawMoney: 0,

            // 当前选择要提现的金额
            withdrawMoney: 0,

            // 税后金额，为实际所得
            afterTaxedMoney: 0
        };
    }

    componentWillReceiveProps(nextProps) {
        // 可提现的最大值为用户红包的余额值
        if (nextProps.available !== this.props.available) {
            this.initMaxWithdrawMoney(nextProps.available);
        }
    }

    componentDidMount() {
        this.initMaxWithdrawMoney(this.props.available);
    }

    initMaxWithdrawMoney(available) {
        this.setState({
            maxWithdrawMoney: available
        });
    }

    handleWithdrawMoney = () => {
        let { withdrawMoney, afterTaxedMoney, maxWithdrawMoney } = this.state;

        this.props.withdrawMoney(withdrawMoney, afterTaxedMoney, maxWithdrawMoney)
            .then((newMaxWithdrawMoney) => {
                this.setState({
                    maxWithdrawMoney: newMaxWithdrawMoney,
                    withdrawMoney: 0,
                    afterTaxedMoney: 0
                });
            })
            .catch((err) => {
                if (process.env.NODE_ENV !== 'production') {
                    console.error('handleWithdrawMoney err', err);
                }
            });
    };

    handleSelectQuota = (index) => {
        const { maxWithdrawMoney } = this.state;
        const { quotas } = this.props;
        const quotaValue = quotas[index];

        const result = this.props.selectQuota(quotaValue, maxWithdrawMoney);

        if (!result) {
            return;
        }

        this.setState({
            withdrawMoney: result.withdrawMoney,
            afterTaxedMoney: result.afterTaxedMoney
        });
    };

    render() {
        let { uid, quotas } = this.props;
        let { maxWithdrawMoney, withdrawMoney, afterTaxedMoney } = this.state;

        return (
            <div className="display-withdraw">
                <WithdrawWalletTips uid={uid} />

                <WithdrawQuotas
                    maxWithdrawMoney={maxWithdrawMoney}
                    withdrawMoney={withdrawMoney}
                    afterTaxedMoney={afterTaxedMoney}
                    quotas={quotas}
                    selectQuota={this.handleSelectQuota}
                />

                <WithdrawBalanceTips maxWithdrawMoney={maxWithdrawMoney} />

                <WithdrawSubmit disabled={!withdrawMoney} enter={this.handleWithdrawMoney} />
            </div>
        );
    }
}