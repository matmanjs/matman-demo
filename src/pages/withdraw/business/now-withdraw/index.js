import { closeCurrentWebView } from '../app-now';
import { showAlert, showErrorTips } from '../base-tips';

/**
 * 国家规定的收取税费为 20%
 *
 * @type {Number}
 */
export const TAX = 0.2;

export const CHECK_RESULT = {
    GO_WITHDRAW: 'GO_WITHDRAW',
    GO_VERIFY_PHONE: 'GO_VERIFY_PHONE',
    GO_VERIFY_ID: 'GO_VERIFY_ID',
    GO_RULE: 'GO_RULE',
    CANCEL: 'CANCEL',
    WITHDRAW_EMPTY: 'WITHDRAW_EMPTY'
};

/**
 * 错误码，注意这里的错误码是本项目 CGI 接口通用的，而不仅局限提现接口，并且这里列举的也不是全部错误码，部分错误码保持通用提示即可
 * @type {{}}
 */
export const ERR_CODE = {
    // 活动不存在
    ACTIVE_EMPTY: 20,

    // 活动已结束
    ACTIVE_CLOSE: 21,

    // 每人每天只能提现一次
    TRANS_USER_LIMIT: 22,

    // 今天总提现次数用完
    TRANS_TOTAL_LIMIT: 23
};

/**
 * 活动的提示文案，由产品提供
 * @type {{}}
 */
export const ERR_MSG = {
    [ERR_CODE.ACTIVE_EMPTY]: '该活动不存在，请重新加载',
    [ERR_CODE.ACTIVE_CLOSE]: '一/二/三期红包活动已结束，请关注参与下期红包活动',
    [ERR_CODE.TRANS_USER_LIMIT]: '每位用户每天最多可提现一次',
    [ERR_CODE.TRANS_TOTAL_LIMIT]: '今日提现名额已发放完毕，请明日再来'
};

export function getCurUid() {
    return '123456';
}

/**
 * 跳转到手机认证页面
 */
export function jumpToVerifyPhonePage() {
    const URL = window.location.href.replace(/[^\/]*\.html/gi, 'verify-phone.html');

    setTimeout(() => {
        window.location.href = `${URL}`;
    }, 200);
}

/**
 * 跳转到身份证认证页面
 */
export function jumpToVerifyIdPage() {
    const URL = window.location.href.replace(/[^\/]*\.html/gi, 'verify-id.html');

    setTimeout(() => {
        window.location.href = `${URL}`;
    }, 200);
}

export function dealWithdraw(params) {
    const {
        withdrawMoney,
        isPhoneVerified,
        isIdVerified,
        withdrawHandler
    } = params;

    return checkBeforeWithdraw(withdrawMoney, isPhoneVerified, isIdVerified)
        .then((type) => {
            switch (type) {
                case CHECK_RESULT.GO_WITHDRAW:
                    withdrawHandler();
                    break;
                case CHECK_RESULT.GO_VERIFY_PHONE:
                    jumpToVerifyPhonePage();
                    break;
                case CHECK_RESULT.GO_VERIFY_ID:
                    jumpToVerifyIdPage();
                    break;
                case CHECK_RESULT.WITHDRAW_EMPTY:
                    showAlert('请先选择金额之后再提现！');
                    break;
                default:
                    break;
            }

            return type;
        });
}

export function checkBeforeWithdraw(withdrawMoney, isPhoneVerified, isIdVerified) {
    return new Promise((resolve) => {
        if (!withdrawMoney) {
            resolve(CHECK_RESULT.WITHDRAW_EMPTY);
        } else if (!isPhoneVerified) {
            resolve(CHECK_RESULT.GO_VERIFY_PHONE);
        } else if (!isIdVerified) {
            resolve(CHECK_RESULT.GO_VERIFY_ID);
        } else {
            resolve(CHECK_RESULT.GO_WITHDRAW);
        }
    });
}

/**
 * 检查选择提现额度选项的合法性
 *
 * @param {Number} value 当前选择的提现金额，单位为分钱
 * @param {Number} maxWithdrawMoney 当前用户允许提现的最大值，单位为分钱
 * @return {Object}
 */
export function checkSelectQuota(value, maxWithdrawMoney) {
    if (!value || value > maxWithdrawMoney) {
        return null;
    }

    return {
        withdrawMoney: value,
        afterTaxedMoney: Math.round(value * (1 - TAX) * 100) / 100
    };
}

/**
 * 处理成功的提现结果
 *
 * @param result
 * @param withdrawMoney
 * @param afterTaxedMoney
 * @return {Promise<any>}
 */
export function dealWithdrawResultSuccess(result = {}, withdrawMoney, afterTaxedMoney) {
    return new Promise((resolve, reject) => {
        let data = result.data || {};

        if (data.isSuccess) {
            let tips = `你的${withdrawMoney / 100}元（税前）提现申请已提交，税后实际到账${afterTaxedMoney / 100}元。请到QQ钱包-点击QQ钱包余额数字-交易记录查看。`;

            showAlert(tips)
                .then(() => {
                    // 关闭当前页面
                    closeCurrentWebView();

                    resolve();
                })
                .catch((err) => {
                    reject(err);
                });
        } else {
            showErrorTips(`(${data.result})${data.err || '网络异常，请稍候再试'}`);
            resolve();
        }
    });
}

/**
 * 处理失败的提现结果
 * @param error
 * @return {Promise<any>}
 */
export function dealWithdrawResultFail(error = {}) {
    return new Promise((resolve, reject) => {
        let err = error.error || error || {};
        let codeTips = err.retcode ? `(code=${err.retcode})` : '';

        // 处理异常的错误码
        if (ERR_MSG[err.retcode]) {
            showAlert(ERR_MSG[err.retcode]);
        } else {
            showErrorTips(`网络异常，请稍候再试${codeTips}`);
        }

        resolve();
    });
}