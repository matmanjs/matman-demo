const env = require('./env');

module.exports = (opts) => {
    return env.createPageDriver(__filename, opts)

        // 加载页面地址
        .goto(env.getPageUrl())

        // 第一步：开始操作之前
        .addAction('init', function (nightmare) {
            // nightmare 支持所有的原始 nightmare 语法和对其定制的扩展功能
            return nightmare.wait(500);
        })

        // 第二步：点击使用 location 调用 jsbridge
        .addAction('selectQuota', function (nightmare) {
            return nightmare.click('#call-by-location');
        })

        // 需要等待某些条件达成，才开始运行爬虫脚本
        .wait(env.WAIT.READY)

        // 爬虫脚本的函数，用于获取页面中的数据
        .evaluate(() => {
            return {
                remarks: '调试使用 location 调用 jsbridge'
            };
        })

        // 结束，获取结果
        .end();
};

// module.exports({ show: true, doNotCloseBrowser: true, useRecorder: true })
//     .then(function (result) {
//         console.log(JSON.stringify(result));
//     })
//     .catch(function (error) {
//         console.error('failed:', error);
//     });
