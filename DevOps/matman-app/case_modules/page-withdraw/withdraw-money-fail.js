const path = require('path');
const matman = require('matman');
const {BrowserRunner} = require('matman-runner-puppeteer');

const {BASIC_QUERY_DATA_MAP, WAIT} = require('./env');

module.exports = async pageDriverOpts => {
  const pageDriver = await matman.launch(new BrowserRunner(), pageDriverOpts);

  // 走指定的代理服务，由代理服务配置请求加载本地项目，从而达到同源测试的目的
  await pageDriver.useProxyServer(await matman.getLocalWhistleServer(8899));

  await pageDriver.useMockstar(
    Object.assign({}, BASIC_QUERY_DATA_MAP, pageDriverOpts.queryDataMap),
  );

  await pageDriver.setDeviceConfig('iPhone 6');

  await pageDriver.setScreenshotConfig(true);

  // 本页面实际需要有登录态信息，自动化测试时手动设置 cookie
  await pageDriver.setCookieConfig('myuin=123456');

  await pageDriver.setPageUrl('http://now.qq.com/withdraw');

  // 第一步：开始操作之前
  await pageDriver.addAction('init', async page => {
    await page.waitFor(WAIT.READY);
  });

  // 第二步：选中【5元】
  await pageDriver.addAction('selectQuota', async page => {
    await page.click('#root .display-withdraw .display-withdraw-quotas .selection .i0');
  });

  // 第三步：点击【确定】按钮
  await pageDriver.addAction('clickSubmit', async page => {
    await page.click('#root .display-withdraw .withdraw-submit .now-button');
    await page.waitFor(500);
  });

  // 第四步：点击弹窗中的【确定】按钮
  await pageDriver.addAction('clickDlgOk', async page => {
    await page.click('.base-alert .dialog-inner .dialog-buttons .dialog-btn.ok');
  });

  return await pageDriver.evaluate(path.resolve(__dirname, './crawlers/get-page-info.js'));
};

// module
//   .exports({
//     show: true,
//     doNotCloseBrowser: true,
//     useRecorder: true,
//     queryDataMap: {
//       withdraw_money: 'error_20_active_empty',
//     },
//   })
//   .then(function (result) {
//     console.log(JSON.stringify(result));
//   })
//   .catch(function (error) {
//     console.error('failed:', error);
//   });
