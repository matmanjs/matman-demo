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
        mockstarQuery: env.mockstarCases.getMockStarQuery(opts.mockerMap),
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
    });
}

module.exports = getResult;

// getResult({
//     show: true, doNotEnd: true, useRecorder: false, mockerMap: {
//         'withdraw_money': 'error_20_active_empty'
//     }
// })
//     .then(function (result) {
//         console.log(JSON.stringify(result));
//     })
//     .catch(function (error) {
//         console.error('failed:', error);
//     });
//

