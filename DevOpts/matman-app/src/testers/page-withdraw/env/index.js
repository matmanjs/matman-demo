const utils = require('../../../lib/utils');
const mockstarCases = require('./mockstar-cases');

const OPTS = {
    WAIT: '#loaded'
};

/**
 * 获取页面的地址
 * @param isDev
 * @param opts
 * @return {String}
 */
function getPageUrl(isDev, opts) {
    return utils.getPageUrl('http://now.qq.com/withdraw', isDev);
}

module.exports = {
    getPageUrl,
    getProxyServer: utils.getProxyServer,
    getCaseParser: utils.getCaseParser,
    OPTS,
    mockstarCases
};
