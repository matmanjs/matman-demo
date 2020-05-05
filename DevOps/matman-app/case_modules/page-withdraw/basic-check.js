const env = require('./env');

function getResult(opts) {
    return env.createPageDriver(__filename, opts)

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

getResult({
    show: true,
    doNotCloseBrowser: true,
    useRecorder: false,
    queryDataMap: {
        // 查询余额
        'get_balance': 'success_16888',

        // 拉取认证状态
        'get_verify_status': 'success_all_ok',

        // 申请提现
        'withdraw_money': 'success'
    }
})
    .then(function (result) {
        console.log(JSON.stringify(result));
    })
    .catch(function (error) {
        console.error('failed:', error);
    });
