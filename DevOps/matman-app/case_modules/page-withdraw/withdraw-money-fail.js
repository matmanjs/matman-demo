const env = require('./env');

function getResult(opts) {
    return env.createPageDriver(__filename, opts)

        // 加载页面地址
        .goto(env.getPageUrl())

        // 第一步：开始操作之前
        .addAction('init', function (nightmareRun) {
            // nightmareRun 支持所有的原始 nightmare 语法和对其定制的扩展功能
            return nightmareRun.wait(500);
        })

        // 第二步：选中【5元】
        .addAction('selectQuota', function (nightmareRun) {
            return nightmareRun.click('#root .display-withdraw .display-withdraw-quotas .selection .i0');
        })

        // 第三步：点击【确定】按钮
        .addAction('clickSubmit', function (nightmareRun) {
            return nightmareRun.click('#root .display-withdraw .withdraw-submit .now-button').wait(500);
        })

        // 第四步：点击弹窗中的【确定】按钮
        .addAction('clickDlgOk', function (nightmareRun) {
            return nightmareRun.click('.base-alert .dialog-inner .dialog-buttons .dialog-btn.ok');
        })

        // 需要等待某些条件达成，才开始运行爬虫脚本
        .wait(env.WAIT.READY)

        // 爬虫脚本的函数，用于获取页面中的数据
        .evaluate('./crawlers/get-page-info.js')

        // 结束，获取结果
        .end();
}

module.exports = getResult;

// getResult({
//     show: true,
//     doNotCloseBrowser: true,
//     useRecorder: false,
//     queryDataMap: {
//         'withdraw_money': 'error_20_active_empty'
//     }
// })
//     .then(function (result) {
//         console.log(JSON.stringify(result));
//     })
//     .catch(function (error) {
//         console.error('failed:', error);
//     });
