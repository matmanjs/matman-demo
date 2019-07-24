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

    handleWithdrawMoney = (withdrawMoney, afterTaxedMoney, maxValue) => {
        return new Promise((resolve, reject) => {
            let { isPhoneVerified, isIdVerified } = this.props;

            // 处理提现的逻辑
            dealWithdraw(withdrawMoney, isPhoneVerified, isIdVerified, () => {
                // 请求提现的接口
                this.props.loadWithdrawMoney(withdrawMoney)
                    .then((result) => {
                        this.reportWithdrawResult(true, withdrawMoney);

                        // 处理成功的提现接口的访问结果
                        dealWithdrawResultSuccess(result, withdrawMoney, afterTaxedMoney)
                            .then(() => {
                                // 为了更为准确，重新拉取一次接口
                                this.props.loadBalanceInfo();

                                // 提现成功需要及时更新下余额
                                resolve(maxValue - withdrawMoney);
                            })
                            .catch((err) => {
                                reject(err);
                            });
                    })
                    .catch((err) => {
                        // console.error(err);
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
            })
                .catch((err) => {
                    reject(err);
                });
        });
    };

    reportWithdrawResult = (isSuccess, withdrawMoney) => {
        if (process.env.NODE_ENV !== 'production') {
            console.log('reportWithdrawResult(isSuccess, withdrawMoney)', isSuccess, withdrawMoney);
        }
    };

    handleSelectQuota = (quotaValue, maxValue) => {
        return checkSelectQuota(quotaValue, maxValue);
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
