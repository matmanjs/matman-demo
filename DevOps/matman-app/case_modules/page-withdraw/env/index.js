const { createPageDriver } = require('../../../helpers');

/**
 * mockstar 数据模拟中的基础桩数据设置
 *
 * @type {Object}
 */
const BASIC_QUERY_DATA_MAP = {
    // 查询余额
    'get_balance': 'success_2340',

    // 拉取认证状态
    'get_verify_status': 'success_all_ok',

    // 申请提现
    'withdraw_money': 'success'
};

/**
 * 运行爬虫脚本之前的条件
 *
 * @type {Object}
 */
const WAIT = {
    READY: '#loaded'
};

/**
 * 获取页面的地址
 *
 * @param [isDev]
 * @return {String}
 */
function getPageUrl(isDev) {
    return 'http://now.qq.com/withdraw';
}

module.exports = {
    getPageUrl,
    WAIT,
    createPageDriver: (caseModuleFilePath, opts = {}) => {
        // 设置默认的桩数据
        opts.queryDataMap = Object.assign({}, BASIC_QUERY_DATA_MAP, opts.queryDataMap);

        return createPageDriver(caseModuleFilePath, opts);
    }
};
