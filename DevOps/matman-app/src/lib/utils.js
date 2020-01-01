const urlHandle = require('url-handle');
const urlParse = require('url-parse');
const matman = require('matman');

/**
 * 获取页面的链接地址
 *
 * @param {String} pageUrl 页面地址
 * @param {Boolean} [isDev] 是否为开发环境
 * @param {Object} [urlQueryOpts] 附加在 URL 上的额外参数
 * @returns {String}
 */
function getPageUrl(pageUrl, isDev, urlQueryOpts = {}) {
    const urlParseResult = urlParse(pageUrl);

    const protocol = isDev ? 'http:' : 'https:';

    // 开发场景和生产环境的地址不一样
    if (isDev) {
        urlQueryOpts.now_n_http = 1;
        urlQueryOpts.no_eruda = 1;
        urlQueryOpts.no_logger = 1;
    } else {
        urlQueryOpts._bid = 3683;
    }

    // TODO query 应该和 urlQueryOpts 合并
    return urlHandle.getUrl(`${protocol}//${urlParseResult.host}${urlParseResult.pathname}${urlParseResult.query}`, urlQueryOpts);
}

/**
 * 当前是否为开发场景
 * @param {Boolean} [isDev] 开发场景
 * @return {String | undefined}
 */
function getProxyServer(isDev) {
    // 非开发模式下不使用 whistle 代理
    if (!isDev) {
        return;
    }

    const whistlePort = process.env.WHISTLE_PORT || '8080';

    return `localhost:${whistlePort}`;
}

/**
 * 获得 case parser
 * @param {String} caseBasePath case的根目录
 * @return {matman.CaseParser}
 */
function getCaseParser(caseBasePath) {
    return new matman.CaseParser(caseBasePath);
}

module.exports = {
    getProxyServer,
    getPageUrl,
    getCaseParser
};