const utils = require('../../../lib/utils');
const mockstarCases = require('./mockstar-cases');

const OPTS = {
    WAIT: '#container'
};

/**
 * 获取页面的地址
 * @param isDev
 * @return {String}
 */
function getPageUrl(isDev) {
    return utils.getPageUrl('http://localhost:3000/simple', isDev);
}

module.exports = {
    getPageUrl,
    getProxyServer: utils.getProxyServer,
    getCaseParser: utils.getCaseParser,
    OPTS,
    mockstarCases
};
