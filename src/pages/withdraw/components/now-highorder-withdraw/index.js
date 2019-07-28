import React, { Component } from 'react';
import { connect } from 'react-redux';

import DisplayWithdraw from '../now-display-withdraw';

import { loadWithdrawMoney } from '../../data/now-data-withdraw';
import { loadBalanceInfo } from '../../data/now-data-balance';

import {
    checkSelectQuota,
    dealWithdraw,
    dealWithdrawResultFail,
    dealWithdrawResultSuccess,
    getCurUid
} from '../../business/now-withdraw';

class HighorderWithdraw extends Component {
    constructor(props, context) {
        super(props, context);

        this.uid = getCurUid();
    }

    /**
     *  处理提交提现操作的逻辑
     * @param {Number} withdrawMoney 用户需要的提现金额，单位为"分钱"
     * @param {Number} afterTaxedMoney 税后金额，单位为"分钱"
     * @param {Number} maxWithdrawMoney 当前用户所能够提现的最大值，单位为"分钱"
     * @return {Promise<any>} resolve 值为提现成功之后的新的余额
     */
    handleWithdrawMoney = (withdrawMoney, afterTaxedMoney, maxWithdrawMoney) => {
        return new Promise((resolve, reject) => {
            let { isPhoneVerified, isIdVerified } = this.props;

            // 处理提现的逻辑
            dealWithdraw({
                withdrawMoney,
                maxWithdrawMoney,
                isPhoneVerified,
                isIdVerified,
                withdrawHandler: () => {
                    // 请求提现的接口
                    this.props.loadWithdrawMoney(withdrawMoney)
                        .then((result) => {
                            this.reportWithdrawResult(true, withdrawMoney);

                            // 处理成功的提现接口的访问结果
                            dealWithdrawResultSuccess(result, withdrawMoney, afterTaxedMoney)
                                .then(() => {
                                    // 为了更为准确，重新拉取一次查询余额的接口
                                    this.props.loadBalanceInfo();

                                    // 提现成功需要及时更新下余额，避免等接口回来时有个时间差
                                    resolve(maxWithdrawMoney - withdrawMoney);
                                })
                                .catch((err) => {
                                    reject(err);
                                });
                        })
                        .catch((err) => {
                            this.reportWithdrawResult(false, withdrawMoney);

                            // 处理失败的提现接口的访问结果
                            dealWithdrawResultFail(err)
                                .then(() => {
                                    reject();
                                })
                                .catch((err) => {
                                    reject(err);
                                });
                        });
                }
            })
                .catch((err) => {
                    reject(err);
                });
        });
    };

    /**
     * 处理选择提现金额时的逻辑
     * @param {Number} quotaValue 当前选中的提现额度，单位为"分钱"
     * @param {Number} maxWithdrawMoney 当前用户所能够提现的最大值，单位为"分钱"
     * @return {{withdrawMoney, afterTaxedMoney}}
     */
    handleSelectQuota = (quotaValue, maxWithdrawMoney) => {
        return checkSelectQuota(quotaValue, maxWithdrawMoney);
    };

    /**
     * 数据上报：提现操作的结果
     * @param {Boolean} isSuccess 提现操作是否成功
     * @param {Number} withdrawMoney 提现金额
     */
    reportWithdrawResult = (isSuccess, withdrawMoney) => {
        if (process.env.NODE_ENV !== 'production') {
            console.log('reportWithdrawResult(isSuccess, withdrawMoney)', isSuccess, withdrawMoney);
        }
    };

    render() {
        let { isLoaded, available, quotas } = this.props;

        return (
            <DisplayWithdraw
                isLoaded={isLoaded}
                uid={this.uid}
                available={available}
                quotas={quotas}
                selectQuota={this.handleSelectQuota}
                withdrawMoney={this.handleWithdrawMoney}
            />
        );
    }
}

function mapStateToProps(state) {
    let { balanceInfo, verifyInfo } = state;

    return {
        isLoaded: balanceInfo.isLoaded,
        available: balanceInfo.available,
        quotas: balanceInfo.quotas,
        isPhoneVerified: verifyInfo.isPhoneVerified,
        isIdVerified: verifyInfo.isIdVerified
    };

}

function mapDispatchToProps(dispatch) {
    return {
        loadWithdrawMoney(amount) {
            return dispatch(loadWithdrawMoney(amount));
        },

        loadBalanceInfo() {
            return dispatch(loadBalanceInfo());
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(HighorderWithdraw);
