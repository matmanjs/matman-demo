const matman = require('matman');

/**
 * 创建端对端测试的 page driver
 *
 * @param {String} caseModuleFilePath caseModule的根目录，必须要绝对路径
 * @param {Object} opts 额外参数
 * @return {opts}
 * @author helinjiang
 */
function createPageDriver(caseModuleFilePath, opts) {
    return matman

        // 创建 PageDriver，页面驱动控制器
        .createPageDriver(__filename, opts)

        // 无头浏览器使用 nightmare.js 框架提供，其底层用的是 Google 的 electron，基于 chromium 内核
        .useNightmare({ show: opts.show })

        // 走指定的代理服务，由代理服务配置请求加载本地项目，从而达到同源测试的目的
        .useProxyServer(`127.0.0.1:${process.env.PORT || 8899}`)

        // 设置截屏
        .setScreenshotConfig(true);
}

module.exports = {
    createPageDriver
};