const path = require('path');
const matman = require('matman');
const {BrowserRunner} = require('matman-runner-puppeteer');

const {BASIC_QUERY_DATA_MAP} = require('./env');

module.exports = async pageDriverOpts => {
  // 创建 PageDriver，API 详见 https://matmanjs.github.io/matman/api/
  const pageDriver = await matman.launch(new BrowserRunner(), pageDriverOpts);

  // 走指定的代理服务，由代理服务配置请求加载本地项目，从而达到同源测试的目的
  await pageDriver.useProxyServer(await matman.getLocalWhistleServer(8899));

  // 设置 mock server
  await pageDriver.useMockstar(BASIC_QUERY_DATA_MAP);

  // 设置浏览器设备型号
  await pageDriver.setDeviceConfig('iPhone 6');

  // 设置截屏
  await pageDriver.setScreenshotConfig(true);

  // 设置页面地址
  await pageDriver.setPageUrl('http://now.qq.com/withdraw');

  // 增加自定义动作
  await pageDriver.addAction('scanPage', async page => {
    await page.waitFor('#loaded');
  });

  // 获取结果
  return await pageDriver.evaluate(path.resolve(__dirname, './crawlers/get-page-info.js'));
};

// module
//   .exports({
//     show: true,
//     doNotCloseBrowser: true,
//     useRecorder: true,
//   })
//   .then(function (result) {
//     console.log(JSON.stringify(result));
//   })
//   .catch(function (error) {
//     console.error('failed:', error);
//   });
