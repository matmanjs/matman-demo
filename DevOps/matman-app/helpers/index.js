const matman = require('matman');
const { createMockStarQuery } = require('mockstar');

/**
 * 创建端对端测试的 page driver
 *
 * @param {String} caseModuleFilePath caseModule的根目录，必须要绝对路径
 * @param {Object} opts 额外参数
 * @return {matman.PageDriver}
 * @author helinjiang
 */
function createPageDriver(caseModuleFilePath, opts = {}) {
    const pageDriver = matman

        // 创建 PageDriver，页面驱动控制器
        .createPageDriver(caseModuleFilePath, opts)

        // 无头浏览器使用 nightmare.js 框架提供，其底层用的是 Google 的 electron，基于 chromium 内核
        .useNightmare({ show: process.env.SHOW_BROWSER || opts.show })

        // 设置浏览器参数
        .setDeviceConfig('mobile')

        // 走指定的代理服务，由代理服务配置请求加载本地项目，从而达到同源测试的目的
        .useProxyServer(`127.0.0.1:${process.env.WHISTLE_PORT || 8899}`)

        // 设置截屏
        .setScreenshotConfig(true);

    // 使用 mockstar 来做构造假数据
    if (opts.queryDataMap) {
        pageDriver.useMockstar(createMockStarQuery(opts.queryDataMap));
    }

    return pageDriver;
}

module.exports = {
    createPageDriver
};