const { createPageDriver } = require('../../../helpers');

/**
 * 运行爬虫脚本之前的条件
 *
 * @type {{READY: string}}
 */
const WAIT = {
    READY: '#container'
};

/**
 * 获取页面的地址
 *
 * @param [isDev]
 * @return {String}
 */
function getPageUrl(isDev) {
    return 'http://now.qq.com/simple';
}

module.exports = {
    getPageUrl,
    WAIT,
    createPageDriver
};
