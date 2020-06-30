const path = require('path');
const matman = require('matman');
const {BrowserRunner} = require('matman-runner-puppeteer');

const {BASIC_QUERY_DATA_MAP} = require('./env');

module.exports = async pageDriverOpts => {
  const pageDriver = await matman.launch(new BrowserRunner(), pageDriverOpts);

  // 走指定的代理服务，由代理服务配置请求加载本地项目，从而达到同源测试的目的
  await pageDriver.useProxyServer(await matman.getLocalWhistleServer(8899));

  await pageDriver.useMockstar(BASIC_QUERY_DATA_MAP);

  await pageDriver.setDeviceConfig('iPhone 6');

  await pageDriver.setScreenshotConfig(true);

  // 本页面实际需要有登录态信息，自动化测试时手动设置 cookie
  await pageDriver.setCookieConfig('myuin=123456');

  await pageDriver.setPageUrl('http://now.qq.com/withdraw');

  // 第一步：开始操作之前
  await pageDriver.addAction('init', async page => {
    await page.waitFor('#loaded');
  });

  // 第二步：还未选择提现金额之前，直接点击【确定】按钮
  await pageDriver.addAction('clickSubmitBeforeSelect', async page => {
    await page.click('#root .display-withdraw .withdraw-submit .now-button');
    await page.waitFor(500);
  });

  // 第三步：点击提示没有选择金额的弹窗中的【确定】按钮
  await pageDriver.addAction('clickNotSelectMoneyDlgOk', async page => {
    await page.click('.base-alert .dialog-inner .dialog-buttons .dialog-btn.ok');
  });

  // 第四步：选中【30元】
  await pageDriver.addAction('selectQuota30', async page => {
    await page.click('#root .display-withdraw .display-withdraw-quotas .selection .i2');
  });

  // 第五步：选中【15元】
  await pageDriver.addAction('selectQuota15', async page => {
    await page.click('#root .display-withdraw .display-withdraw-quotas .selection .i1');
  });

  // 第六步：点击【确定】按钮
  await pageDriver.addAction('clickSubmit', async page => {
    await page.click('#root .display-withdraw .withdraw-submit .now-button');
    await page.waitFor(500);
  });

  // 第七步：点击弹窗中的【确定】按钮
  await pageDriver.addAction('clickDlgOk', async page => {
    await page.click('.base-alert .dialog-inner .dialog-buttons .dialog-btn.ok');
  });

  // 第八步：一秒后再次获取页面状态
  await pageDriver.addAction('lastCheck', async page => {
    await page.waitFor(1000);
  });

  const matmanResult = await pageDriver.evaluate(
    path.resolve(__dirname, './crawlers/get-page-info.js'),
  );

  // 是否跳转到了首页
  matmanResult.isRedirectToPageIndex = matmanResult.isExistPage('/abc/index', {}, 200);

  return matmanResult;
};

module
  .exports({
    show: true,
    doNotCloseBrowser: false,
    useRecorder: false,
  })
  .then(function (result) {
    console.log(JSON.stringify(result));
  })
  .catch(function (error) {
    console.error('failed:', error);
  });
