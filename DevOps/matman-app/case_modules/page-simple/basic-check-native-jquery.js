const env = require('./env');

function getResult(opts) {
    return env.createPageDriver(__filename, opts)

        // 加载页面地址
        .goto(env.getPageUrl())

        // 需要等待某些条件达成，才开始运行爬虫脚本
        .wait(env.WAIT.READY)

        // 爬虫脚本的函数，用于获取页面中的数据
        .evaluate('./crawlers/get-page-info-jquery.js')

        // 结束，获取结果
        .end();
}

module.exports = getResult;

getResult({ show: true, doNotCloseBrowser: true, useRecorder: false })
    .then(function (result) {
        console.log(JSON.stringify(result));
    })
    .catch(function (error) {
        console.error('failed:', error);
    });
