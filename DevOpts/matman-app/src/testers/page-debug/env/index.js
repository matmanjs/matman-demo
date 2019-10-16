const utils = require('../../../lib/utils');

const OPTS = {
    WAIT: '#container'
};

/**
 * 获取页面的地址
 * @param isDev
 * @return {String}
 */
function getPageUrl(isDev) {
    return utils.getPageUrl('http://now.qq.com/debug', isDev);
}

module.exports = {
    getPageUrl,
    getProxyServer: utils.getProxyServer,
    getCaseParser: utils.getCaseParser,
    OPTS
};
