const { createMockStarQuery } = require('mockstar');
const env = require('./env');

function getResult(opts) {
    return env.createPageDriver(__filename, opts)

        // 使用 mockstar 来做构造假数据
        .useMockstar(createMockStarQuery(opts.queryDataMap))

        // 加载页面地址
        .goto(env.getPageUrl())

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
//         'get_flow': 'success_basic',
//         // 'get_flow': 'success_empty',
//     }
// })
//     .then(function (result) {
//         console.log(JSON.stringify(result));
//     })
//     .catch(function (error) {
//         console.error('failed:', error);
//     });
