const path = require('path');
const matman = require('matman');
const {BrowserRunner} = require('matman-runner-puppeteer');

module.exports = async pageDriverOpts => {
    const pageDriver = await matman.launch(new BrowserRunner(), pageDriverOpts);

    // 走指定的代理服务，由代理服务配置请求加载本地项目，从而达到同源测试的目的
    await pageDriver.useProxyServer(await matman.getLocalWhistleServer(8899));

    await pageDriver.setDeviceConfig('iPhone 6');

    await pageDriver.setScreenshotConfig(true);

    await pageDriver.setPageUrl('http://now.qq.com/simple');

    await pageDriver.addAction('scanPage', async page => {
        await page.waitFor('#container');
    });

    return await pageDriver.evaluate(path.resolve(__dirname, './crawlers/get-page-info-jquery.js'));
};

// module
//   .exports({
//       show: true,
//       doNotCloseBrowser: true,
//       useRecorder: false,
//   })
//   .then(function (result) {
//       console.log(JSON.stringify(result));
//   })
//   .catch(function (error) {
//       console.error('failed:', error);
//   });
