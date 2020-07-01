const _ = require('lodash');
const matman = require('matman');
const {BrowserRunner} = require('matman-runner-puppeteer');

/**
 * 创建端对端测试的 page driver
 *
 * @param {String} caseModuleFilePath caseModule的根目录，必须要绝对路径
 * @param {Object} pageDriverOpts 额外参数
 * @param {Object} [queryDataMap] 额外参数
 * @author helinjiang
 */
async function createPageDriver(caseModuleFilePath, pageDriverOpts, queryDataMap) {
  // 创建 PageDriver，API 详见 https://matmanjs.github.io/matman/api/
  const pageDriver = await matman.launch(
    new BrowserRunner(),
    _.merge({}, pageDriverOpts, {caseModuleFilePath}),
  );

  // 走指定的代理服务，由代理服务配置请求加载本地项目，从而达到同源测试的目的
  await pageDriver.useProxyServer(await matman.getLocalWhistleServer(8899));

  // 使用 mockstar 来做 mock server 用于构造假数据
  if (queryDataMap || pageDriverOpts.queryDataMap) {
    pageDriver.useMockstar(_.merge({}, queryDataMap, pageDriverOpts.queryDataMap));
  }

  // 设置浏览器设备型号
  await pageDriver.setDeviceConfig('iPhone 6');

  // 设置截屏
  await pageDriver.setScreenshotConfig(true);

  return pageDriver;
}

module.exports = {
  createPageDriver,
};
