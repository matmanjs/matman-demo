const env = require('./env');

function getResult(opts) {
    return env.createPageDriver(__filename, opts)

        // 加载页面地址
        .goto(env.getPageUrl())

        // 第一步：开始操作之前
        .addAction('init', function (nightmare) {
            // nightmare 支持所有的原始 nightmare 语法和对其定制的扩展功能
            return nightmare.wait(500);
        })

        // 第二步：还未选择提现金额之前，直接点击【确定】按钮
        .addAction('clickSubmitBeforeSelect', function (nightmare) {
            return nightmare.click('#root .display-withdraw .withdraw-submit .now-button').wait(500);
        })

        // 第三步：点击提示没有选择金额的弹窗中的【确定】按钮
        .addAction('clickNotSelectMoneyDlgOk', function (nightmare) {
            return nightmare.click('.base-alert .dialog-inner .dialog-buttons .dialog-btn.ok');
        })

        // 第四步：选中【30元】
        .addAction('selectQuota30', function (nightmare) {
            return nightmare.click('#root .display-withdraw .display-withdraw-quotas .selection .i2');
        })

        // 第五步：选中【15元】
        .addAction('selectQuota15', function (nightmare) {
            return nightmare.click('#root .display-withdraw .display-withdraw-quotas .selection .i1');
        })

        // 第六步：点击【确定】按钮
        .addAction('clickSubmit', function (nightmare) {
            return nightmare.click('#root .display-withdraw .withdraw-submit .now-button').wait(500);
        })

        // 第七步：点击弹窗中的【确定】按钮
        .addAction('clickDlgOk', function (nightmare) {
            return nightmare.click('.base-alert .dialog-inner .dialog-buttons .dialog-btn.ok');
        })

        // 第八步：一秒后再次获取页面状态
        .addAction('lastCheck', function (nightmare) {
            return nightmare.wait(1000);
        })

        // 需要等待某些条件达成，才开始运行爬虫脚本
        .wait(env.WAIT.READY)

        // 爬虫脚本的函数，用于获取页面中的数据
        .evaluate('./crawlers/get-page-info.js')

        // 结束，获取结果
        .end()
        .then(function (result) {
            // 是否跳转到了首页
            result.isRedirectToPageIndex = result.isExistPage('/abc/index', {}, 200);

            return result;
        });
}

module.exports = getResult;

// getResult({ show: true, doNotCloseBrowser: true, useRecorder: true })
//     .then(function (result) {
//         console.log(JSON.stringify(result));
//     })
//     .catch(function (error) {
//         console.error('failed:', error);
//     });
