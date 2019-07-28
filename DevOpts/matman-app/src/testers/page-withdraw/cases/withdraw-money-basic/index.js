const env = require('../../env');

function getResult(opts, pageOpts) {
    // 1. 获取 caseParser对象
    const caseParser = env.getCaseParser(__dirname);

    // 2. 获取页面的 url
    const pageUrl = env.getPageUrl(true, pageOpts);

    // 3. 获取 crawlerScript 爬虫脚本路径
    const crawlerScriptPath = caseParser.getCrawlerScriptPath('../../crawlers/get-page-info');

    // 4. 获得一些配置参数
    const reqOpts = Object.assign({
        proxyServer: env.getProxyServer(true),
        wait: env.OPTS.WAIT,
        mockstarQuery: env.mockstarCases.getBasic(),
        screenshot: true
    }, opts);

    // 5. 执行并返回 Promise 结果
    return caseParser.handleOperate(pageUrl, crawlerScriptPath, reqOpts, (testAction) => {
        // 第一步：开始操作之前
        testAction.addAction(function (nightmareRun) {
            return nightmareRun.wait(500);
        });

        // 第二步：选中【5元】
        testAction.addAction(function (nightmareRun) {
            return nightmareRun.click('#root .display-withdraw .display-withdraw-quotas .selection .i0');
        });

        // 第三步：点击【确定】按钮
        testAction.addAction(function (nightmareRun) {
            return nightmareRun.click('#root .display-withdraw .withdraw-submit .now-button').wait(500);
        });

        // 第四步：点击弹窗中的【确定】按钮
        testAction.addAction(function (nightmareRun) {
            return nightmareRun.click('.base-alert .dialog-inner .dialog-buttons .dialog-btn.ok');
        });

        // 第五步：一秒后再次获取页面状态
        testAction.addAction(function (nightmareRun) {
            return nightmareRun.wait(1000);
        });
    })
        .then(function (result) {
            // 过滤出是否跳转到其他页面
            const pageWithdraw = '/abc/index';

            result.isRedirectToPageIndex =result.isExistPage(pageWithdraw);

            return result;
        });
}

module.exports = getResult;

// getResult({ show: true, doNotEnd: true, useRecorder: true })
//     .then(function (result) {
//         console.log(JSON.stringify(result));
//     })
//     .catch(function (error) {
//         console.error('failed:', error);
//     });


