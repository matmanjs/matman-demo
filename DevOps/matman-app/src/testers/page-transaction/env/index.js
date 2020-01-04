const utils = require('../../../lib/utils');
const mockstarCases = require('./mockstar-cases');

const OPTS = {
    WAIT: '#root .display-transaction'
};

/**
 * 获取页面的地址
 * @param isDev
 * @return {String}
 */
function getPageUrl(isDev) {
    return utils.getPageUrl('http://now.qq.com/transaction', isDev);
}

module.exports = {
    getPageUrl,
    getProxyServer: utils.getProxyServer,
    getCaseParser: utils.getCaseParser,
    OPTS,
    mockstarCases
};
