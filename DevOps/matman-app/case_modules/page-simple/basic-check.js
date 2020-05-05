const { createPageDriver } = require('../../helpers');

function getResult(opts) {
    return createPageDriver(__filename, opts)

        // 加载页面地址
        .goto('http://now.qq.com/simple')

        // 需要等待某些条件达成，才开始运行爬虫脚本
        .wait('#container')

        // 爬虫脚本的函数，用于获取页面中的数据
        .evaluate('./crawlers/get-page-info.js')

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



