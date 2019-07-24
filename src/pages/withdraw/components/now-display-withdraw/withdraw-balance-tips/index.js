import React from 'react';

import './index.less';

export default function DisplayWithdrawBalanceTips(props) {
    const { maxValue } = props;

    if (!maxValue) {
        return null;
    }

    return (
        <div className="withdraw-balance-tips row">
            <span className="value">可提现余额(元)：{maxValue / 100}</span>
        </div>
    );
}